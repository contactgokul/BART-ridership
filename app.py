# Dependencies
from flask import Flask, render_template, redirect, jsonify
import pymysql
from config import password

# Create a connection to the MySQL database
db = pymysql.connect("localhost", "root", f"{password}", "bart_db")

# Create an instance of Flask
app = Flask(__name__)

@app.route('/data')
def data():
    cursor = db.cursor()
    sql = "SELECT * FROM merged"
    cursor.execute(sql)
    columns = [col[0] for col in cursor.description] # gets the column headers in the merged table
    results = [dict(zip(columns, row)) for row in cursor.fetchall()] # output is a list of dictionaries
    return render_template("data.html", results = results)




if __name__ == "__main__":
    app.run(debug=True)
