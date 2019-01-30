var url = `/trips`;
console.log(url);

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

        // Use the new URL to create an object containing exit station counties
        var counties = [];
        d3.json(url1, function(data) {
            console.log(data);

            data.forEach(function(obj) {
                if (counties.indexOf(obj["county"]) == -1) {
                    counties.push(obj["county"])
                }
            });
            console.log(counties);
        });


    };
    entryID.on("change", handleChange);
});