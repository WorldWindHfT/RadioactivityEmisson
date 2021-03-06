/* Nasa World Wind project of the HfT Stuttgart 2016
	Copyright: Selamawit Tesera Amdie, Maria Prama Haque, Daniela Palacios Lopez, Alexander Steinbrück
	*/
/**
 * @version $Id: Shapefiles.js 3361 2015-07-31 19:28:04Z tgaskins $
 */

/*  ****************************************************************************************************
 This function is to load the initial World Wind Globe wiht the selected control buttons and layers */
 /* Inside this function the infraestructure of the power plants is also loaded */
 
function eventWindowLoaded(){
	WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
   
	wwd = new WorldWind.WorldWindow("canvasOne");

    // Add a compass, a coordinates display and some view controls to the World Window.
    wwd.addLayer(new WorldWind.CompassLayer());
	wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
    wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
	
	layers=[
	{layer : new WorldWind.BingAerialWithLabelsLayer(),enabled:true},
	{layer : new WorldWind.BMNGLayer(), enabled:false},
	{layer: new WorldWind.BMNGLandsatLayer(), enabled: false}
	];
	
	for (var l = 0; l < layers.length; l++) {
		layers[l].layer.enabled = layers[l].enabled;
		wwd.addLayer(layers[l].layer)}; 
	
	/* Here we load the polygons that represent each the Power Plant infraestructe, paying attentin to the field height for 3D
	representation*/
	
	var shapeConfigurationCallback = function (attributes,record) {
            var configuration = {};
            configuration.height = attributes.values.height || attributes.values.Height || attributes.values.HEIGHT;
			configuration.attributes = new WorldWind.ShapeAttributes(null);
			// Fill the polygon with a random pastel color.
            configuration.attributes.interiorColor=WorldWind.Color.DARK_GRAY;
            // Paint the outline in a darker variant of the interior color.
            configuration.attributes.outlineColor=WorldWind.Color.LIGHT_GRAY;	
			return configuration;
		};			
	// Create layer for the Power Plants
	var shapefileLibrary = "./data/Radioactivity";
	PowerPlantsLayer = new WorldWind.RenderableLayer("PowerPlants");
	PowerPlantsLayer.pickEnabled = false
	var PowerPShapefile = new WorldWind.Shapefile(shapefileLibrary + "/PowerPlants.shp" );
	PowerPShapefile .load(null,shapeConfigurationCallback,PowerPlantsLayer);
	wwd.addLayer(PowerPlantsLayer);
	var property = document.getElementById("bt4");
	property.style.backgroundColor ="#449d44";
	property.style.color = "white"
	
	//Create Layer for Stations
	StationLayer = new WorldWind.RenderableLayer("Stations")
	wwd.addLayer(StationLayer);
	
	//Create a Layer for the Interpolation
	Interpolation = new WorldWind.RenderableLayer();
	Interpolation.displayName = "Interpolation";
	Interpolation.opacity = 0.5;
	Interpolation.enabled = true;
	Interpolation.pickEnabled = false;
	wwd.addLayer(Interpolation)

		
};
	


 /*************************************************************************************/
 /*This function is to load the shapefile of measuring stations of the selected power plant. When the user selects a Power Plant it zooms to that area. 
 Here the coordinates of each Power Plant are burned are "burned"  */
 
function Load(select,id){
	var selectedOption = select.options[select.selectedIndex];
	var sel = document.getElementById(id);
	sel.remove(selectedOption.value)
	
	if (selectedOption.value =="/Neckarwestheim_Stations.shp"){
		this.wwd.goTo(new WorldWind.Position(49.040115,9.172109,3000));
	}
	
	// General Attibutes for all the measuring stations.
	// Black dot, white labels.
	var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
	placemarkAttributes.imageScale = 0.05
	placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
		WorldWind.OFFSET_FRACTION, 0.1,
		WorldWind.OFFSET_FRACTION, 1.0);
	placemarkAttributes.labelAttributes.color= WorldWind.Color.WHITE;
	placemarkAttributes.labelAttributes.font=new WorldWind.Font(15);
	placemarkAttributes.imageSource = "./images/npp4.jpg"

	// Iterating through each record.
	var shapeConfigurationCallback = function (attributes,record){
		var station = {};
		station.name = attributes.values.name || attributes.values.Name;
		station.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);	
		// Set-up highlight attributes:
		highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
		highlightAttributes.imageScale = 0.2;
		station.highlightAttributes = highlightAttributes;
		return station;
		}

	// Create layer for Stations.
	
	var shapefileLibrary = "./data/Radioactivity";
	var StationsShapefile = new WorldWind.Shapefile(shapefileLibrary + selectedOption.value);
	StationsShapefile.load(null,shapeConfigurationCallback,StationLayer);

	// Automatically Activate the Layer.
	var property = document.getElementById("bt3");
	property.style.backgroundColor ="#449d44";
	property.style.color = "white"
		
	// Now set up to handle highlighting.
	var highlightController = new WorldWind.HighlightController(wwd)
		
	// Listening to Mouse Clicks to open an a new HTML.
	var clickRecognizer = new WorldWind.ClickRecognizer(wwd,LoadGraph)
	
	// Controlling the picking and highlighting:
	var highlightedItems=[];
	var handlePick = function(o){
		var x = o.clientX,
		    y = o.clientY;
	
	var redrawRequired = highlightedItems.length > 0; 
	
	for (var h = 0; h < highlightedItems.length; h++) {
		highlightedItems[h].highlighted = false;
        }
           
	highlightedItems = [];
	var pickedObjects = wwd.pick(wwd.canvasCoordinates(x, y));
	if (pickedObjects.objects.length > 0){
	redrawRequired = true;
	}
	
	if (pickedObjects.objects.length > 0){
		for (var p = 0; p < pickedObjects.objects.length; p++) {
			pickedObjects.objects[p].userObject.highligted = true;
			highlightedItems.push(pickedObjects.objects[p].userObject);
			// Show the coordinates of each station when the mouse is on top of them
			if (pickedObjects.objects[p].labelPicked) {
				var selstation = pickedObjects.objects[p]
				Coordinates(selstation); 
            }
			else {
				console.log("No Selection");
				
			}
		}
	}
	
	}	
	wwd.addEventListener("mousemove",handlePick)		
};

/*  **************************************************************************************** */
/* This Function is to open a new HTML that contains the graphs of each measuring station    */

function LoadGraph(recognizer){
	
	var x = recognizer.clientX,
    y = recognizer.clientY;
	
	var pickedObjects = wwd.pick(wwd.canvasCoordinates(x, y));
	if (pickedObjects.objects[0].parentLayer.displayName == "Stations"){
		var station = pickedObjects.objects[0].userObject.label;
		};
					
	var graphLibrary = "./graphs/"+station+".htm"
	window.open(graphLibrary);
	pickedObjects.clear()
};

/* ***************************************************************************************** */
/* This function shows an infowindo with the coordiantes of each station. */

function Coordinates(selstation){
	var name = selstation.userObject.label
	var latitude = selstation.userObject.position.latitude
	var longitude = selstation.userObject.position.longitude
	document.getElementById("Latitude").value = " "+latitude;
	document.getElementById("Longitude").value = " "+longitude;
	document.getElementById("Station_Name").value = " "+name;
	document.getElementById("Latitude").value = " "+latitude;
	document.getElementById("Longitude").value = " "+longitude;


}

/* ***************************************************************************************** */
 
function onoffLayers(layerButton) {
        var layerName = layerButton.value;
        for (var i = 0, len = wwd.layers.length; i < len; i++) {
            var layer = wwd.layers[i];
            if (layer.hide) {
                continue;
            }
            if (layer.displayName === layerName) {
                layer.enabled = !layer.enabled;
				if (layer.enabled){
					layerButton.style.backgroundColor ="#449d44";
					layerButton.style.color = "white"
				} else{
					layerButton.style.backgroundColor = "#FFFFFF"
					layerButton.style.color = "black"
				}
                wwd.redraw();
                break;
            }
        }
 };

/* ************************************************************* */
/* This function Loads the selected image and adds it to the Interpolationlayer */
 
 function LoadImage(select){
		
		Interpolation.removeAllRenderables();
		// get the parameters for the selected image
		var month = document.getElementById("IDropdownMonth").value;
		var year = document.getElementById("IDropdownYear").value;
		var station_inter = document.getElementById("mySelect").textContent;
        var Interpolation_Image = new WorldWind.SurfaceImage(new WorldWind.Sector(48.976441, 49.119624,9.087372, 9.278806),
        "./images/Interpolation/"+station_inter+"_"+ month +"_"+year+".jpg");
		

			

		
        var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d"),
            size = 64, c = size / 2  - 0.5, innerRadius = 5, outerRadius = 20;

        canvas.width = size;
        canvas.height = size;

        // Add the surface images to the Interpolationlayer		
		Interpolation.addRenderable(Interpolation_Image);
		
		// Automatically Activate the Layer.
		var property = document.getElementById("bt5");
		property.style.backgroundColor ="#449d44";
		property.style.color = "white"

		
		this.wwd.redraw();
		console

}
