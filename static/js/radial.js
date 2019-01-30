var url = `/trips`;
console.log(url);

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
        console.log(url1);

        // Use the new URL to create an object containing counties and their exit stations
        var counties = {}; // empty object that will contain county names as keys
        var arrayCounties = []; // empty array that will contain an array for each exit station in the county
                                // will serve as the value for the object 'counties'

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
                counties[arrayCounties[i]] = chunks(counties[arrayCounties[i]],1)
            };
            console.log(counties);

        });


    };
    entryID.on("change", handleChange);
});

