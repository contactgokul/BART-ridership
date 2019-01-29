from flask import Flask, render_template, redirect, jsonify
# if first time, run pip install flask_mysqldb from terminal
from flask_mysqldb import MySQL
import re

# from werkzeug import generate_password_hash, check_password_hash

# Create an instance of Flask
app = Flask(__name__)
mysql = MySQL(app)

# MySQL Configuration
# mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'bart_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

# conn = mysql.connect()

# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Find one record of data from the mongo database
    # mars_data = mongo.db.collection.find_one()
    # return "Welcome!"
    # Return template and data
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM mysql.bart_db''')
    rv = cur.fetchall()
    # return (rv)
    
    return render_template("index.html")


# Route that will trigger the scrape function
# @app.route("/scrape")
# def scrape():
#     # mars_data = mongo.db.mars_data
#     scraped_data = scrape_mars.scrape_info()
#     mongo.db.collection.update({}, scraped_data, upsert=True)
#     return redirect("/", code=302) #Try with and without code 302


if __name__ == "__main__":
    app.run(debug=True)
