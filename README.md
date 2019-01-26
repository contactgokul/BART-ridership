# Project 2

## Requirements

1. Your visualization must include a Python Flask powered RESTful API, HTML/CSS, JavaScript, and at least one database (MySQL, MongoDB, SQLite, etc.)

1. Your project should fall into one of the below four tracks: 
	* A custom "creative" D3.js project (i.e. non-standard graph or chart)

	* A combination of Web Scraping and Leaflet or Plotly

	* A dashboard page with multiple charts all updating from the same data

	* A "thick" server that performs multiple manipulations on data in a database prior to visualization (must be approved)

3. Your project should include at least one JS library that we did not cover.

4. Your project must be powered by a dataset with at least 100 records.

5. Your project must include some level of user-driven interaction (e.g. menus, dropdowns, textboxes, etc.)

6. Your final visualization should ideally include at least three views

## Grading Rubrics:

### A:
Complete all requirements and do something exceptional. Some examples are and contain the following:
* Having a well organized GitHub Repository, which should include but not limited to:
    * A good README file which:
  	  * explains process really well.
        * has a link to your deliverables.
        * explains important/main files and folders. 
    * File names should be easy to understand or pseudocoded so people without data analytics experience can understand. 
* Creating **creative** visualizations, some examples are:  
    * [D3 Gallery](https://github.com/d3/d3/wiki/Gallery) \(You don't need to create graphs that are too complex, but try to create unconventional graphs.\)
    * Maps with filters, layers, and so on.
    * Anything else creative but not listed here.
* Creating visualizations and dashboards that are easy to look at and digest(some factors are axis, graphs' layout, colors, themes)
* All members participate in the delivery of presentation. Presentation tells a story.
* Anything that's great to have but not listed here.

### B: 

Complete all requirements and:
* Has a README file.
* Creating visualizations and dashboards.
* Delivery of presentation.(both speech and presented materials)

### C or below:
Fail to complete some of the requirements.

### I:
Fail to submit the project or fail to deliver the presentation.

## Project description
This project plots 2018 [BART monthly ridership data](https://www.bart.gov/about/reports/ridership) on a map featuring San Francisco, Alameda, and Contra Costa counties. Each BART station is represented by a marker on the station's coordinates. These coordinates are obtained from the [BART stations API](https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y). Additional information about each station is contained in its tooltip. The map can then be used to glean insights about how commuters use BART.

The [project wiki](https://github.com/ryanloney/BART-ridership/wiki) provides a detailed description of how the project has been built.
