## Executive Summary
The [Bay Area Rapid Transit](https://www.bart.gov/) (BART) currently connects four California counties via rail: Alameda, Contra Costa, San Francisco, and San Mateo. In the future, BART will also connect to Santa Clara when the [Milpitas and Berryessa BART stations open](https://www.mercurynews.com/2018/06/11/bart-to-milpitas-berryessa-may-not-happen-until-late-2019/). BART fare gates obtain information about each paid trip like origin and destination stations, and date and time of travel. Ridership information is made available online to everyone interested in this type of information. The aim of this study is to use the publicly available data to find insights about how commuters used BART in 2018.

The product is a dashboard containing dynamic graphs that visualise the 2018 ridership data in the form of a bar chart of monthly ridership, a chord diagram tracing the trip routes at the county level, and a map on which the number of rides is represented by the size of the radius of the circle marking each BART station. 

## Method Summary
For this project, the 2018 [BART monthly ridership data](https://www.bart.gov/about/reports/ridership) was downloaded as Excel spreadsheets, one for each month and information about station, which contain information (including geographic coordinates) was accessed from the [BART stations API](https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y). These datasets were cleaned using Python; imported into a MySQL database; and then converted into interactive plots in a landing page using HTML, CSS, and JavaScript.

The [project wiki](https://github.com/ryanloney/BART-ridership/wiki) provides a detailed description of how the project has been built. In summary:
- Back-end
    - [app.py](https://github.com/ryanloney/BART-ridership/blob/master/app.py) is a Flask app that creates API endpoints accessible to JavaScript and can render content onto the template
    - [BART-Ridership_data_processing.ipynb](https://github.com/ryanloney/BART-ridership/blob/master/BART-Ridership_data_processing.ipynb) for data cleaning and exporting into a database
    -[toMySql.sql](https://github.com/ryanloney/BART-ridership/blob/master/toMySql.sql) is the MySQL database used in this project
    - `config.py` contains the password for MySQL
- Front-end
    - templates/[index.html](https://github.com/ryanloney/BART-ridership/blob/master/templates/index.html) is the landing page and template containing text and graphs
    - static/css/[style.css](https://github.com/ryanloney/BART-ridership/blob/master/static/css/style.css) contains formatting specifications
    - static/js/[chord.js](https://github.com/ryanloney/BART-ridership/blob/master/static/js/chord.js) renders a chord diagram using the ZingChart library
    - static/js/[radial.js](https://github.com/ryanloney/BART-ridership/blob/master/static/js/radial.js) renders an interactive bar chart using the amCharts library
    - static/js/[scatter.js](https://github.com/ryanloney/BART-ridership/blob/master/static/js/scatter.js) renders a map of the counties where BART operates, overlaid with markers corresponding to BART stations
    - static/js/[config.js] contains the API key for mapbox

