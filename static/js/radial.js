// Part I: Extracting Data from the APIs //
var url = `/trips`;
console.log(url);

var counties = {}; // empty object that will contain county names as keys
var arrayCounties = []; // empty array that will contain an array for each exit station in the county
                        // will serve as the value for the object 'counties'


// Create a function that cuts an array into chunks within a new array (list of lists)
function chunks(array, chunkSize) {
    var index = 0;
    var arrayLength = array.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunkSize) {
        chunk = array.slice(index, index+chunkSize);
        tempArray.push(chunk);
    }
    return tempArray;
};

// 
d3.json(url, function(data){
    console.log(data);

    // Define a variable for entry station selected
    var entryID = d3.select("#entry_station");

    // Define a variable which lists entryIDs that can be selected
    var optionsList = [];
    
    // Populate the list with the Entry_Station from each object in the data array
    data.forEach(function(obj){
        if (optionsList.indexOf(obj["Entry_Station"]) == -1) {
            optionsList.push(obj["Entry_Station"]);
        };
    });
    console.log(optionsList);

    // Populate the select field in index.html with the Entry_Stations
    var options = entryID
        .selectAll("#id")
        .data(optionsList)
        .enter()
        .append("option")
        .text(function(entry_stn) {
            return entry_stn;
        })
        .attr("id", "option")

    // Define the selected entry station
    function handleChange() {
        var selection = entryID.property("value");
        
        // Change the URL to show the selection
        var url1 = `/trips/${selection}`;

        // Use the new URL to create an object containing counties and their exit stations
        d3.json(url1, function(data) {
            console.log(data);

            // Populate arrayCounties
            data.forEach(function(item) {
                if (arrayCounties.indexOf(item["county"]) == -1) {
                    arrayCounties.push(item["county"]);
                };
            });
            console.log(arrayCounties);

            // Populate the counties object
            for (var i = 0; i < data.length; i ++) {
                var datum = data[i];
                if (!counties[datum.county]) {
                    counties[datum.county] = [];
                }
                if (counties[datum.county].indexOf(datum.Exit_Station) == -1) {
                    counties[datum.county].push(datum.Exit_Station);
                };
            };

            // Convert the array of county exit stations into an array of exit station arrays
            for (var i = 0; i < arrayCounties.length; i ++) {
                counties[arrayCounties[i]] = chunks(counties[arrayCounties[i]],1);
            };

            // Append avg weekday trips to the arrays
            data.forEach(function(obj) {
                arrayCounties.forEach(function(county) {
                    counties[county].forEach(function(stn) {
                        if (obj["Exit_Station"] == stn[0]) {
                            stn.push(obj["Avg_Weekday_Trips"]);
                        };
                    });
                    
                });
            });
            console.log(counties);

            // Part II: Create Graphs //
            var startMonth = "Jan";
            var endMonth = "Dec";
            var currentMonth = "Jun";
            var colorSet = new am4core.ColorSet();

            var chart = am4core.create("radial", am4charts.RadarChart);
            chart.numberFormatter.numberFormat = "#.00";
            chart.hiddenState.properties.opacity = 0;

            chart.startAngle = 270 - 180;
            chart.endAngle = 270 + 180;

            chart.padding(5, 15, 5, 10)
            chart.radius = am4core.percent(65);
            chart.innerRadius = am4core.percent(40);

            // Month label goes in the middle
            var monthLabel = chart.radarContainer.createChild(am4core.Label);
            monthLabel.horizontalCenter = "middle";
            monthLabel.verticalCenter = "middle";
            monthLabel.fill = am4core.color("#673AB7");
            monthLabel.fontsize = 30;
            monthLabel.text = String(currentMonth);

            // Zoom out button
            var zoomOutButton = chart.zoomOutButton;
            zoomOutButton.dx = 0;
            zoomOutButton.dy = 0;
            zoomOutButton.marginBottom = 15;
            zoomOutButton.parent = chart.rightAxesContainer;

            // Scrollbar
        });
    };
    entryID.on("change", handleChange);
});


