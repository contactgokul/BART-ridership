// 1.0 CREATE LEAFLET MAP WITH BASE & OVERLAY MAPS
// createMap function has map variable tied to HTML "#map-id"
function createMap(bartStations) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bartStations layer
    var overlayMaps = {
      "BART Stations": bartStations
    };
  
  //   // Create the map object with options
  //   var map1 = L.map("map-id1", {
  //   center: [37.8037, -122.2714],
  //   zoom: 10.5,
  //   layers: [lightmap, bartStations]
  // });

    // Create the map object with options
    var map = L.map("map-id", {
      center: [37.8037, -122.2714],
      zoom: 10.5,
      layers: [lightmap, bartStations]
    });
  
  //   // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(map);

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
// 2.0 CREATE LEAFLET MARKERS FOR THE MAP TIED TO STATION LOCATIONS
// createMarks function has binds station locations to markers
function createMarkers(response) {

// Pull the "stations" property off of response.data
var stations = response;
console.log(stations);

// Initialize an array to hold bike markers
var bartMarkers = [];

// Loop through the stations array
for (var index = 0; index < stations.length; index++) {
    var station = stations[index];

    // For each station, create a marker and bind a popup with the station's name
    var bartMarker = L.circle([station.gtfs_latitude, station.gtfs_longitude], {
    color: "green",
    fillColor: "green",
    fillOpacity: 0.50,
    radius: station.Avg_Weekday_Trips * 3,
    strokeOpacity: 0.75,
    strokeWidth: 1
    }).bindPopup("<h3>Station: " + station.Exit_Station + "<h3><h3>Avg. Trips: " + station.Avg_Weekday_Trips + "<h3>");

    // Add the marker to the bartMarkers array
    bartMarkers.push(bartMarker);
}

// Create a layer group made from the station markers array, pass it into the createMap function
createMap(L.layerGroup(bartMarkers));
}

// 3.0 CREATE VAR TO GO TO CORRESPONDING TO APP.PY ROUTE.
var url = `/data`;
console.log(url);
  // 3.1 Create D3 function to bind to app.py route. 
  d3.json(url, function(data){

    // Define a variable for entry station selected.  Run map function to populate the variables with
    // unique values from the trips URL.
    var input_station = data.map(d => d.Entry_Station).unique()
    var input_month = data.map(d => d.Month).unique()

    // Check the variables in console
    console.log(input_station);
    console.log(input_month);

    // Use D3 to select the drop down menu tags in the HTML.  Create variables for what you will be selecting to.
    var stationMenu = d3.select("#selDataset1")
    var monthMenu = d3.select("#selDataset2")

    // Populate the select field in index.html with the Entry_Stations and Months
    var options = stationMenu
        .selectAll("#id")
        .data(input_station)
        .enter()
        .append("option")
        .text(function(entry_stn) {
            return entry_stn;
        })
        .attr("id", "option")
    
    var options = monthMenu
        .selectAll("#id")
        .data(input_month)
        .enter()
        .append("option")
        .text(function(entry_mth) {
            return entry_mth;
        })
        .attr("id", "option")

    // Default is Richmond station
    // createObject("/data/RM");
    
    // 3.2 Create Handle Change function which changes the data in the chart to
    // correspond to the Months and Entry_Stations selected in the drop down menus.
    function handleChange() {
        // First the Entry stations
        var selection1 = stationMenu.property("value");
        // Use slice to only get the last two digits of the /data/RM etc. entry station name.
        var lastChar = selection1.slice(-2);
        // Second the Months
        var selection2 = monthMenu.property("value");
        // Change the URL to show the selection.  Note the app.py has data/month/
        // so selection2 comes first.
        console.log(`/trips/${selection2}/${lastChar}`);
        console.log(selection2)
        // Use D3 to select the anchors in the HTML.  Create variable for what you will be selecting to.
        var map = d3.select("#map-id");
        // We must remove the Leaflet map in order to render a new map upon handle change.  Since
        // Leaflet map is inside the createMap function above, we cannot call it globally.  But we can
        // create a new map variable here and remove it from the HTML.  Once we do that, we can append a
        // new #id and #map-id tags to the body, effectively replacing the old one with the old data.   
        map.remove();
        d3.select("body").append("div").attr("id","map-id")
        // Call d3.json on the newly chosen URL and run the createMarkers function above for just that data.  
        d3.json(`/trips/${selection2}/${selection1}`, createMarkers); 
    };
    // Run handle change function on the two variables corresponding to the HTML tags for drop down menus
    // which we created above.
    stationMenu.on("change", handleChange);
    monthMenu.on("change", handleChange);
  
});

// Attempting to render the original markers; can comment this function and d3.json out.
function createBartAPIMarkers(response2) {

  // Pull the "stations" property off of response2.data
  var stations = response2.root.stations.station;

  // Initialize an array to hold bike markers
  var bartMarkers = [];

  // Loop through the stations array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];

    // For each station, create a marker and bind a popup with the station's name
    var bartMarker = L.marker([station.gtfs_latitude, station.gtfs_longitude])
      .bindPopup("<h3>" + station.name + "<h3><h3>Address: " + station.address + "<h3>");

    // Add the marker to the bartMarkers array
    bartMarkers.push(bartMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(bartMarkers));
}

// Perform an API call to the BART API to get station information. Call createMarkers when complete
d3.json("https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y", createBartAPIMarkers);