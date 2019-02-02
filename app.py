# Dependencies
from flask import Flask, render_template, redirect, jsonify
import pymysql
from config import password
from itertools import groupby
from operator import itemgetter

# Create a connection to the MySQL database
def create_connection():
    return pymysql.connect("localhost", "root", f"{password}", "bart_db").cursor()

# Create an instance of Flask
app = Flask(__name__)

@app.route('/')
def index():
    title =  "Bart Ridership in 2018"
    
    text1 = "The Bay Area Rapid Transit (BART) is the rail system that connects four counties (San Francisco, San Mateo, Alameda, and Contra Costa). There are 48 stations whose fare gates record various information including time, date, and station. The information is compiled by BART into ridership reports which are publicly available."
    
    text2 = "Interesting stories may be gleaned from the data provided by BART. For instance, it is possible to find out where passengers mostly go to from a particular entry station. Do passengers take BART from the suburbs to go mainly to San Francisco or to other suburbs? Which line sees the heaviest usage? How do line extensions impact ridership?"

    label1 = "Pick a month in 2018 and see how many trips occurred from one county to another."
    label2 = "Calculations are based on the weekday trip numbers provided by BART."
    subhead1 = "Where Do Passengers Go?"
    subhead2 = "Total Number of Weekday BART Trips in 2018, by Month"
    subhead3 = "Map of 2018 BART Trips"

    return render_template("index.html", title = title, text1 = text1, text2 = text2, label1 = label1, subhead1 = subhead1, label2 = label2, subhead2 = subhead2, subhead3 = subhead3)

@app.route('/data')
def data():
    cursor = create_connection()

    # query includes station coordinates for the Exit Stations
    sql = "SELECT r.Year, r.Month, r.Entry_Station, r.Exit_Station, r.Avg_Weekday_Trips, m.gtfs_latitude, m.gtfs_longitude FROM ridership as r INNER JOIN metadata as m ON m.abbr2 = r.Exit_Station"
    cursor.execute(sql)

    # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] 

    # json format for list of dictionaries
    return jsonify (results)
    
    

@app.route('/metadata')
def metadata():
    cursor = create_connection()
    sql = "SELECT * FROM metadata"
    cursor.execute(sql)

    # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] 

    # json format for list of dictionaries
    return jsonify (results)

@app.route('/trips')
def trips():
    cursor = create_connection()

    # Query allows filtering based on entry station
    sql = f"SELECT r.Year, \
        r.Month, \
        r.Avg_Weekday_Trips, \
        r.Entry_Station, \
        r.Exit_Station, \
        m.county FROM metadata AS m INNER JOIN ridership as r ON m.abbr2 = r.Exit_Station"
    cursor.execute(sql)

     # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] 

    # json format for list of dictionaries
    return jsonify (results)


@app.route('/trips/<month>')
def trips2(month):
    cursor = create_connection()

    # Query allows filtering based on entry station
    sql = f"SELECT r.Year, r.Month, r.Avg_Weekday_Trips, r.Entry_Station, r.Exit_Station, m.county FROM metadata AS m INNER JOIN ridership as r ON m.abbr2 = r.Exit_Station WHERE r.Month = '{month}'"
    cursor.execute(sql)

     # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] 
    # list of stations
    stations = list(set([result["Entry_Station"] for result in results]))
    counties = list(set([result["county"] for result in results]))

    # list of station and county pairs
    stnCounty = [{"station":result["Exit_Station"], "county": result["county"]} for result in results]

    # insert county of entry station in results
    for i in range(0, len(results)):
        for j in range(0, len(stnCounty)):
            if results[i]["Entry_Station"] == stnCounty[j]["station"]:
                results[i]["county_entry"] = stnCounty[j]["county"]
            else:
                continue

    # Remove dictionaries with None values for county
    results1 = []

    for i in range(0, len(results)):
        if results[i]["county_entry"] != None: 
            if results[i]["county"] != None: 
                if results[i]["Avg_Weekday_Trips"] != None:
                    results1.append(results[i])
    
    # Sort by start and end keys
    grouper = itemgetter("county_entry", "county")
    results2 = []

    for key, grp in groupby(sorted(results1, key = grouper), grouper):
        temp_dict = dict(zip(["county_entry", "county"], key))
        temp_dict["qty_trips"] = sum(item["Avg_Weekday_Trips"] for item in grp)
        results2.append(temp_dict)

    
    entrances = []
    # for each station, add a dictionary containing text as station names and value as an empty list
    for county in counties:
        x = {"text": county, "values":[]}
        entrances.append(x)
    
    # if the item entrances["text"] matches the item in results2["county_entry"], add results2[item]["qty_trips"] to entrances["values"]
    for x in range(0,len(results2)):
        for y in range(0,len(entrances)):
            if entrances[y]["text"] == results2[x]["county_entry"]:
                entrances[y]["values"].append(results2[x]["qty_trips"])
            else:
                continue

    # include only the information needed in the html page
    stns = {"type":"chord"}
    stns["series"] = entrances

    # json format for list of dictionaries
    return jsonify (stns)

@app.route('/data/<trip_month>/<entry_station>')
def stations_data(trip_month, entry_station):
    cursor = create_connection()

    # query includes station coordinates for the Exit Stations
    sql = f"SELECT \
        r.Year, \
        r.Month, \
        r.Entry_Station, \
        r.Exit_Station, \
        r.Avg_Weekday_Trips, \
        m.gtfs_latitude, \
        m.gtfs_longitude \
    FROM ridership as r \
        INNER JOIN metadata as m \
        ON m.abbr2 = r.Exit_Station \
        WHERE r.Month = '{trip_month}' \
        AND r.Entry_Station = '{entry_station}'"
    cursor.execute(sql)

    # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]

    # json format for list of dictionaries
    return jsonify (results)

@app.route("/trips1")
def trips3():
    cursor = create_connection()

    # Query allows filtering based on entry station
    sql = f"SELECT r.Year, r.Month, r.Avg_Weekday_Trips, r.Entry_Station, r.Exit_Station, m.county FROM metadata AS m INNER JOIN ridership as r ON m.abbr2 = r.Exit_Station"
    cursor.execute(sql)

    # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] 

    # convert the None's to 0's for weekday trips
    for result in results:
        if result["Avg_Weekday_Trips"] == None:
            result["Avg_Weekday_Trips"] = 0
        else:
            result["Avg_Weekday_Trips"] = result["Avg_Weekday_Trips"]

    # Group list of dictionaries by month
    results2 = []
    results.sort(key = itemgetter("Month"))

    for key, group in groupby(results, lambda item: item["Month"]):
        results2.append({"Month": key, "Trips": sum([item["Avg_Weekday_Trips"] for item in group])})

    # Reorder results2 by month
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    srt = {b:i for i, b in enumerate(months)} # numbers and months

    results2 = sorted(results2, key = lambda x: srt[x["Month"]])

    # json format for list of dictionaries
    return jsonify (results2)

if __name__ == "__main__":
    app.run(debug=True)
