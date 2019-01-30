# Dependencies
from flask import Flask, render_template, redirect, jsonify
import pymysql
from config import password

# Create a connection to the MySQL database
db = pymysql.connect("localhost", "root", f"{password}", "bart_db")

# Create an instance of Flask
app = Flask(__name__)

@app.route('/')
def index():
    title =  "Bart Ridership in 2018"
    text1 = "The Bay Area Rapid Transit (BART) is the rail system that connects three counties (San Francisco, Alameda, and Contra Costa)1. There are 48 stations whose fare gates record various information including time, date, and station2. The information is compiled by BART into ridership reports which are publicly available."
    text2 = "Interesting stories may be gleaned from the data provided by BART. For instance, it is possible to find out where passengers mostly go to from a particular entry station. Do passengers take BART from the suburbs to go mainly to San Francisco or to other suburbs? Which line sees the heaviest usage? How do line extensions impact ridership?"
    return render_template("index.html", title = title, text1 = text1, text2 = text2)

@app.route('/data')
def data():
    cursor = db.cursor()

    # query includes station coordinates for the Exit Stations
    sql = "SELECT r.Year, r.Month, r.Entry_Station, r.Exit_Station, r.Avg_Weekday_Trips, m.gtfs_latitude, m.gtfs_longitude FROM ridership as r INNER JOIN metadata as m ON m.abbr2 = r.Exit_Station"
    cursor.execute(sql)

    # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] 

    # json format for list of dictionaries
    return jsonify (results)
    session.close
    

@app.route('/metadata')
def metadata():
    cursor = db.cursor()
    sql = "SELECT * FROM metadata"
    cursor.execute(sql)

    # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] 

    # json format for list of dictionaries
    return jsonify (results)
    session.close


@app.route('/trips/<entry_station>')
def trips(entry_station):
    cursor = db.cursor()

    # Query allows filtering based on entry station
    sql = f"SELECT r.Year, r.Month, r.Avg_Weekday_Trips, r.Exit_Station, m.county FROM metadata AS m INNER JOIN ridership as r ON m.abbr2 = r.Entry_Station WHERE r.Entry_Station = '{entry_station}'"
    cursor.execute(sql)

     # gets the column headers in the merged table
    columns = [col[0] for col in cursor.description] 

    # output is a list of dictionaries (key: column header, value: data)
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] 

    # json format for list of dictionaries
    return jsonify (results)
    session.close


if __name__ == "__main__":
    app.run(debug=True)
