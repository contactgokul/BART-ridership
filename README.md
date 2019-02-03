## Introduction
The [Bay Area Rapid Transit](https://www.bart.gov/) (BART) currently connects four California counties via rail: Alameda, Contra Costa, San Francisco, and San Mateo. In the future, BART will also connect to Santa Clara when the [Milpitas and Berryessa BART stations open](https://www.mercurynews.com/2018/06/11/bart-to-milpitas-berryessa-may-not-happen-until-late-2019/). BART fare gates obtain information about each paid trip like origin and destination stations, and date and time of travel. Ridership information is made available online to everyone interested in this type of information. The aim of this study is to use the publicly available data to find insights about how commuters used BART in 2018.

The product is a dashboard containing dynamic graphs that visualise the 2018 ridership data in the form of a bar chart of monthly ridership, a chord diagram tracing the trip routes at the county level, and a map on which the number of rides is represented by the size of the radius of the circle marking each BART station. 

## Method Summary
For this project, the 2018 [BART monthly ridership data](https://www.bart.gov/about/reports/ridership) was downloaded as Excel spreadsheets, one for each month and information about station, which contain information (including geographic coordinates) was accessed from the [BART stations API](https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y). These datasets were cleaned using Python; imported into a MySQL database; and then converted into interactive plots in a dashboard using HTML, CSS, and JavaScript.

The [project wiki](https://github.com/ryanloney/BART-ridership/wiki) provides a detailed description of how the project has been built. In summary:
- Back-end
    - [app.py](https://github.com/ryanloney/BART-ridership/blob/master/app.py) is a Flask app that creates API endpoints accessible to JavaScript and can render content onto the template
    - [BART-Ridership_data_processing.ipynb](https://github.com/ryanloney/BART-ridership/blob/master/BART-Ridership_data_processing.ipynb) for data cleaning and exporting into a database
    -[toMySql.sql](https://github.com/ryanloney/BART-ridership/blob/master/toMySql.sql) is the MySQL database used in this project
    - `config.py` contains the password for MySQL; see [this guide on how to create this file](https://github.com/ryanloney/BART-ridership/wiki/2.-Data-loading-onto-a-database)
- Front-end
    - templates/[index.html](https://github.com/ryanloney/BART-ridership/blob/master/templates/index.html) is the dashboard and the template containing text and graphs
    - static/css/[style.css](https://github.com/ryanloney/BART-ridership/blob/master/static/css/style.css) contains formatting specifications
    - static/js/[chord.js](https://github.com/ryanloney/BART-ridership/blob/master/static/js/chord.js) renders a chord diagram using the ZingChart library
    - static/js/[radial.js](https://github.com/ryanloney/BART-ridership/blob/master/static/js/radial.js) renders an interactive bar chart using the amCharts library
    - static/js/[scatter.js](https://github.com/ryanloney/BART-ridership/blob/master/static/js/scatter.js) renders a map of the counties where BART operates, overlaid with markers corresponding to BART stations
    - static/js/`config.js` contains the API key for mapbox; typically not included in repo so check this guide for creating this file

## Output
The dashboard can be divided into four parts. The first part (the landing page) contains a hero section with three buttons leading to the three different visualisations.

![hero](https://github.com/ryanloney/BART-ridership/blob/master/static/img/hero_section.png)

The second part is the chord diagram, visualises data by month. A dropdown button allows readers to change the month and see the number of trips accross counties for the selected month. January ("Jan") is the default setting.

![chord](https://github.com/ryanloney/BART-ridership/blob/master/static/img/BART-chord.png)

The third part features a bar chart with a slider on top. The bars correspond to the number of trips for the months. The default view has 12 months but the slider can be used to reduce the number of months for viewing.

![bar](https://github.com/ryanloney/BART-ridership/blob/efa29879bc5204071f55056015b7089f572df2e1/static/img/BART-bar.png)

The last view is a map with circular markers representing the number of rides terminating in indicated stations for the selected entry station and month.

# Analysis
The results indicated that the number of trips was highest in September 2018 while the lowest was in December. On the other hand, the number of trips originating in San Francisco stations Montgomery and Embarcadero had very high number trip going to many East Bay stations, such as Concord. However, trips starting in Concord and ending in Montgomery or Embarcadero are much fewer. 

December holidays could probably explain the first interesting observation. It is potentially associated with people traveling to their year-end holiday destinations. The second insight could be attributed to the availability and convenience of alternate forms of transportation; e.g., people go into San Francisco by bus or by car pool and then out by BART.