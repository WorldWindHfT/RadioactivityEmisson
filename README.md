Monitoring Nuclear Power Plant Radioactivity Emissions

About the Project

In Germany, radioactive contamination is monitored regularly, however there are no platforms available where citizens can properly visualize this data. The aim is to develop a web application which allows users to visualize the concentration of radioactive contamination in the areas around a Nuclear Power Plant. Germany counts with monitoring networks around all Nuclear Power Plants in the country, so these monitoring stations are the perfect base for this project. 

The used data is recorded by the LUBW in Baden-Württemberg, the data and its license is INSPIRE complaint, which make it open to use for everyone. The measurements are done to monitor the emittance of Radiation from the power plants and detect possible leaks, each station measures the gamma radiation in the unit Sievert (Sv), and in Germany this values are in the range of µSv/h. 

The services of the LUBW provide daily data as CSV-files. For this project, 28 stations around the Neckarwestheim NPP has been downloaded from January to March 2016 and computed the monthly average and the peak values for each month. The data contains the coordinates (DHDN-GKZ3), the name of the station, and the measured value

Approaches 

An interpolation has been done using the Inverse Distance Weighting (IDW) method for visualizing radioactivity emotion from all (28 stations) nuclear power plant stations for each month. A colour coded legend has been use to visualize the results, where the green colour represents less emission from nuclear power plant station then red colour. The interpolation results gives the information of increasing/decreasing level of emitted radioactivity in each month from all available station and an interpretation can be done for taking necessary steps if required. 

Graphical visualization is available in the application based on monthly record (radioactive emission) of each individual station. Which shows the daily radioactive emission based on available month for each nuclear power plant stations. These linear graphs helps to visualize the radioactive emission more precisely. Besides, It gives the trend (increase/decrease) of radioactive emission for whole month.

To do the modification of the csv files and creating the graphs, the Open Office software, for the interpolation of the datasets QGIS and finally Geo-Server as project local server has been use to develop the application. These software have been selected as is all Open Source and compatible with the World Wind API. 

Motivation towards Better Future

Currently more than half of the word population is living in urban areas, so sustainable development of urban areas is key task in urban management. From urban planning perspective, almost every city requires similar urban management tools for a sustainable development. 

Environmental management is one of the major sustainable urban management issues, and when it comes to environmental matters, radioactive discharges from nuclear power plants can have severe impacts, not only on the environments, but also on humans, animals, plants and sea life; without ignoring potential catastrophic disasters. For these reasons, it is important to monitor and analyse samples, to ensure that power plants do not exceed the permitted discharges that members of the public living around nuclear power plants are exposed to.

The objective is to create an open source-guided smart city tool to monitor emitted radioactivity of each (selected) nuclear power plant. So that, later other countries who have nuclear power plants can use the tool to monitor their radioactivity, and take the necessary steps to increase the quality of urban life and work towards sustainable/safe development.  

