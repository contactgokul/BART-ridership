// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("bar", am4charts.XYChart);
chart.scrollbarX = new am4core.Scrollbar();

// Add data
var url = "/trips";
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
    var entryID = d3.select("#entry_station");

    // Define a variable which lists entryIDs that can be selected
    var optionsList = [];

    // Populate the list with the Month from each object in the data array
    data.forEach(function(obj){
        if (optionsList.indexOf(obj["Entry_Station"]) == -1) {
            optionsList.push(obj["Entry_Station"]);
        };
    });
    console.log(optionsList);

    // Populate the select field in index.html with the Months
    var options = entryID
        .selectAll("#ids")
        .data(optionsList)
        .enter()
        .append("option")
        .text(function(month) {
            return month;
        })
        .attr("ids", "option")

        // Default is January chord chart
        createObjects("/trips1");

        // What happens when a month is chosen
        function handleChange() {
            var selection = entryID.property("value");
        
            // Change the URL to show the selection
            url1 = `/trips1/${selection}`;
            createObjects(url1);
        };
        entryID.on("change", handleChange);
});

function createObjects(link){
    console.log(link);

    d3.json(link, function(data) {
        console.log(data);
        createGraphs(data);
    });
};

function createGraphs(data) {   
    chart.data = data; 

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "Month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "Trips";
    series.dataFields.categoryX = "Month";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", (fill, target)=>{
    return chart.colors.getIndex(target.dataItem.index);
    })

    // Cursor
    chart.cursor = new am4charts.XYCursor();
    
};

