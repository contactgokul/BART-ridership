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
    return render_template("index.html", title = title)

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

@app.route('/data/station/<entry_station>')
def stations_data(entry_station):
    cursor = db.cursor()

    # query includes station coordinates for the Exit Stations
    sql = f"SELECT \
        r.Year, \
        r.Month, \
        r.Entry_Station, \
        r.Exit_Station, \
        r.Avg_Weekday_Trips, \
        m.gtfs_latitude, \
        m.gtfs_longitude \
    FROM ridership as r INNER JOIN metadata as m ON m.abbr2 = r.Exit_Station WHERE r.Entry_Station = '{entry_station}'"
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
def trips(Entry_Station):
    cursor = db.cursor()
    sql = "SELECT r.Year, r.Month, r.Entry_Station, r.Exit_Station, r.Avg_Weekday_Trips FROM ridership AS r"


if __name__ == "__main__":
    app.run(debug=True)
