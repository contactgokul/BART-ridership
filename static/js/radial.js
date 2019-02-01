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

// Use D3 to extract data and am4charts to create the radial timeline
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
            delete counties.null;
            console.log(counties);

            // Part II: Create Graphs //
            var startMonth = 1;
            var endMonth = 12;
            var currentMonth = 6;
            var colorSet = new am4core.ColorSet();

            var chart = am4core.create("radial", am4charts.RadarChart);
            chart.numberFormatter.numberFormat = "#.00";
            chart.hiddenState.properties.opacity = 0;

            chart.startAngle = 270 - 180;
            chart.endAngle = 270 + 180;

            chart.radius = am4core.percent(60);
            chart.innerRadius = am4core.percent(40);

            // Month label goes in the middle
            var monthLabel = chart.radarContainer.createChild(am4core.Label);
            monthLabel.horizontalCenter = "middle";
            monthLabel.verticalCenter = "middle";
            monthLabel.fill = am4core.color("#673AB7");
            monthLabel.fontSize = 30;
            monthLabel.text = String(currentMonth);

            // zoomout button
            var zoomOutButton = chart.zoomOutButton;
            zoomOutButton.dx = 0;
            zoomOutButton.dy = 0;
            zoomOutButton.marginBottom = 15;
            zoomOutButton.parent = chart.rightAxesContainer;

            // scrollbar
            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarX.parent = chart.rightAxesContainer;
            chart.scrollbarX.orientation = "vertical";
            chart.scrollbarX.align = "center";

            // vertical orientation for zoom out button and scrollbar to be positioned properly
            chart.rightAxesContainer.layout = "vertical";
            chart.rightAxesContainer.padding(120, 20, 120, 20);

            // category axis
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataFields.category = "Exit_Station";

            var categoryAxisRenderer = categoryAxis.renderer;
            var categoryAxisLabel = categoryAxisRenderer.labels.template;
            categoryAxisLabel.location = 0.5;
            categoryAxisLabel.radius = 28;
            categoryAxisLabel.relativeRotation = 90;

            categoryAxisRenderer.minGridDistance = 13;
            categoryAxisRenderer.grid.template.radius = -25;
            categoryAxisRenderer.grid.template.strokeOpacity = 0.05;
            categoryAxisRenderer.grid.template.interactionsEnabled = false;

            categoryAxisRenderer.ticks.template.disabled = true;
            categoryAxisRenderer.axisFills.template.disabled = true;
            categoryAxisRenderer.line.disabled = true;

            categoryAxisRenderer.tooltipLocation = 0.5;
            categoryAxis.tooltip.defaultState.properties.opacity = 0;

            // value axis
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.max = 100;
            valueAxis.strictMinMax = true;
            valueAxis.tooltip.defaultState.properties.opacity = 0;
            valueAxis.tooltip.animationDuration = 0;
            valueAxis.cursorTooltipEnabled = true;
            valueAxis.zIndex = 10;

            var valueAxisRenderer = valueAxis.renderer;
            valueAxisRenderer.axisFills.template.disabled = true;
            valueAxisRenderer.ticks.template.disabled = true;
            valueAxisRenderer.minGridDistance = 30;
            valueAxisRenderer.grid.template.strokeOpacity = 0.05;


            // series
            var series = chart.series.push(new am4charts.RadarColumnSeries());
            series.columns.template.width = am4core.percent(90);
            series.columns.template.strokeOpacity = 0;
            series.dataFields.valueY = currentMonth;
            series.dataFields.categoryX = "Exit_Station";
            series.tooltipText = "{categoryX}:{valueY.Avg_Weekday_Trips}";

            // this makes columns to be of a different color, depending on value
            series.heatRules.push({ target: series.columns.template, property: "fill", minValue: -3, maxValue: 6, min: am4core.color("#673AB7"), max: am4core.color("#F44336"), dataField: "valueY" });

            // cursor
            var cursor = new am4charts.RadarCursor();
            chart.cursor = cursor;
            cursor.behavior = "zoomX";

            cursor.xAxis = categoryAxis;
            cursor.innerRadius = am4core.percent(40);
            cursor.lineY.disabled = true;

            cursor.lineX.fillOpacity = 0.2;
            cursor.lineX.fill = am4core.color("#000000");
            cursor.lineX.strokeOpacity = 0;
            cursor.fullWidthLineX = true;

            // month slider
            var monthSliderContainer = chart.createChild(am4core.Container);
            monthSliderContainer.layout = "vertical";
            monthSliderContainer.padding(0, 38, 0, 38);
            monthSliderContainer.width = am4core.percent(100);

            var monthSlider = monthSliderContainer.createChild(am4core.Slider);
            monthSlider.events.on("rangechanged", function () {
                updateRadarData(startMonth + Math.round(monthSlider.start * (endMonth - startMonth)));
            })
            monthSlider.orientation = "horizontal";
            monthSlider.start = 0.5;

            chart.data = generateRadarData();

            function generateRadarData() {
                var data = [];
                var i = 0;
                for (var county in counties) {
                    var countyData = counties[county];
                    // console.log(countyData);

                    countyData.forEach(function (exit) {
                        var rawDataItem = { "Exit Station": exit[0] }

                        for (var y = 2; y < exit.length; y++) {
                            rawDataItem[(startMonth + y - 2)] = exit[y];
                        }

                        data.push(rawDataItem);
                    });

                    createRange(county, countyData, i);
                    i++;

                }
                console.log(data);
                return data;
            }


            function updateRadarData(month) {
                if (currentMonth != month) {
                    currentMonth = month;
                    monthLabel.text = String(currentMonth);
                    series.dataFields.valueY = currentMonth;
                    chart.invalidateRawData();
                }
            }

            function createRange(name, countyData, index) {

                var axisRange = categoryAxis.axisRanges.create();
                axisRange.axisFill.interactionsEnabled = true;
                axisRange.text = name;
                // first exit
                axisRange.category = countyData[0][0];
                // last exit
                axisRange.endCategory = countyData[countyData.length - 1][0];

                // every 3rd color for a bigger contrast
                axisRange.axisFill.fill = colorSet.getIndex(index * 3);
                axisRange.grid.disabled = true;
                axisRange.label.interactionsEnabled = false;

                var axisFill = axisRange.axisFill;
                axisFill.innerRadius = -0.001; // almost the same as 100%, we set it in pixels as later we animate this property to some pixel value
                axisFill.radius = -20; // negative radius means it is calculated from max radius
                axisFill.disabled = false; // as regular fills are disabled, we need to enable this one
                axisFill.fillOpacity = 1;
                axisFill.togglable = true;

                axisFill.showSystemTooltip = true;
                axisFill.readerTitle = "click to zoom";
                axisFill.cursorOverStyle = am4core.MouseCursorStyle.pointer;

                axisFill.events.on("hit", function (event) {
                    var dataItem = event.target.dataItem;
                    if (!event.target.isActive) {
                        categoryAxis.zoom({ start: 0, end: 1 });
                    }
                    else {
                        categoryAxis.zoomToCategories(dataItem.category, dataItem.endCategory);
                    }
                })

                // hover state
                var hoverState = axisFill.states.create("hover");
                hoverState.properties.innerRadius = -10;
                hoverState.properties.radius = -25;

                var axisLabel = axisRange.label;
                axisLabel.location = 0.5;
                axisLabel.fill = am4core.color("#ffffff");
                axisLabel.radius = 0;
                axisLabel.relativeRotation = 0;
            }

            var slider = monthSliderContainer.createChild(am4core.Slider);
            slider.start = 1;
            slider.events.on("rangechanged", function () {
                var start = slider.start;

                chart.startAngle = 270 - start * 179 - 1;
                chart.endAngle = 270 + start * 179 + 1;

                valueAxis.renderer.axisAngle = chart.startAngle;
            })



        });
    };
    entryID.on("change", handleChange);
});


