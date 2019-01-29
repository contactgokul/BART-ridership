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
    sql = "SELECT * FROM ridership"
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




if __name__ == "__main__":
    app.run(debug=True)
