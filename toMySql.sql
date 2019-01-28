-- Create and use customer_db
DROP DATABASE IF EXISTS bart_db;
CREATE DATABASE bart_db;
USE bart_db;

-- Create tables for raw data to be loaded into
CREATE TABLE ridership (
id FLOAT PRIMARY KEY,
entry_station TEXT,
exit_station TEXT,
yr_mo DATE,
yr FLOAT,
mo TEXT,
avg_weekday_trips DECIMAL(2)
);

-- Select all data
select * from ridership;