function createMap(bartStations) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Create an overlayMaps object to hold the bartStations layer
  var overlayMaps = {
    "BART Stations": bartStations
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [37.8037, -122.2714],
    zoom: 10.5,
    layers: [lightmap, darkmap, bartStations]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

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
      color: "transparent",
      fillColor: "green",
      fillOpacity: 0.45,
      radius: station.Avg_Weekday_Trips * 2,
      strokeOpacity: 0.75,
      strokeWidth: 1
    }).bindPopup("<h3>Station: " + station.Exit_Station + "<h3><h3>Avg. Trips: " + station.Avg_Weekday_Trips + "<h3>");

    // Add the marker to the bartMarkers array
    bartMarkers.push(bartMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(bartMarkers));
}


// Perform an API call to the BART API to get station information. Call createMarkers when complete
// d3.json("https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y", createMarkers);
d3.json("/trips/Jan/EM", createMarkers);