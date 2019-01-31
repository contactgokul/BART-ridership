// Part I: Extracting Data from the APIs //
var url = `/trips`;
console.log(url);

var url1;
var stations = [];

var stns = {"type":"chord"};

// Use the new URL to create an object containing months and their trips
function createObject(link, stations) {
    console.log(link);
    console.log(stations);

    // Create an array of trips per entrance
    var entrances = stations.map(value => ({"text": value, "values":[]}));
    // console.log(entrances);

    // Using the data for the month...
    d3.json(link, function(obj) {
        console.log(obj);

        // Loop through each object and extract the average number of weekday trips 
        for (var i = 0; i < obj.length; i ++) {
            for (var j = 0; j < entrances.length; j ++) {
                if (obj[i]["Entry_Station"] == entrances[j]["text"]) {
                    entrances[j]["values"].push(obj[i]["Avg_Weekday_Trips"]);
                };
            };
        };
        console.log(entrances);

        // Include entrances array in the stns object
        stns["series"] = entrances;
        // console.log(stns);
        createGraph(stns);

    });
};

// Use stns to create graphs
function createGraph(stns) {
    console.log(stns);

    zingchart.render({ 
        id : 'chartdiv', 
        data : stns, 
        height: "100%", 
        width: "100%",
    });
}

// Use D3 to extract data and another library to create the graph
d3.json(url, function(data){
    console.log(data[0]);

    // Populate stations
    data.forEach(function(item) {
        if (stations.indexOf(item["Entry_Station"]) == -1) {
            stations.push(item["Entry_Station"]);
        };
    });
    // console.log(stations);

    // Define a variable for month selected
    var entryID = d3.select("#month_sel");

    // Define a variable which lists entryIDs that can be selected
    var optionsList = [];

    // Populate the list with the Month from each object in the data array
    data.forEach(function(obj){
        if (optionsList.indexOf(obj["Month"]) == -1) {
            optionsList.push(obj["Month"]);
        };
    });
    console.log(optionsList);

    // Populate the select field in index.html with the Months
    var options = entryID
        .selectAll("#id")
        .data(optionsList)
        .enter()
        .append("option")
        .text(function(month) {
            return month;
        })
        .attr("id", "option")

        // What happens when a month is chosen
        function handleChange() {
            var selection = entryID.property("value");
        
            // Change the URL to show the selection
            url1 = `/trips/${selection}`;
            // console.log(url1);
            createObject(url1, stations);
        };
        entryID.on("change", handleChange);
});

// var chartData = {
//     type: 'bar',  // Specify your chart type here.
//     title: {
//       text: 'My First Chart' // Adds a title to your chart
//     },
//     legend: {}, // Creates an interactive legend
//     series: [  // Insert your series data here.
//         { values: [35, 42, 67, 89]},
//         { values: [28, 40, 39, 36]}
//     ]
//   };
//   zingchart.render({ // Render Method[3]
//     id: 'chartDiv',
//     data: chartData,
//     height: 400,
//     width: 600
//   });