// Define the
var url = `/trips`;
var url1;
var stations = [];
var stns;

// Use the new URL to create an object containing months and their trips
function createObject(link) {
    console.log(link);

    // Using the data for the month...
    d3.json(link, function(obj) {
        // console.log(obj);

        // Define stns as the object in the json for the chosen month
        stns = obj;
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

// Use D3 to extract data ZingCharts library to create the graph
d3.json(url, function(data){
    console.log(data[0]);

    // Populate stations
    data.forEach(function(item) {
        if (stations.indexOf(item["Entry_Station"]) == -1) {
            stations.push(item["Entry_Station"]);
        };
    });
    console.log(stations);

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
            createObject(url1);
        };
        entryID.on("change", handleChange);
});