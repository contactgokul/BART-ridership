-- Create and use bart_db
DROP DATABASE IF EXISTS bart_db;
CREATE DATABASE bart_db;
USE bart_db;

-- Create table for raw data to be loaded into
CREATE TABLE ridership (
ID FLOAT PRIMARY KEY,
Entry_Station TEXT,
Exit_Station TEXT,
Yr_Mo DATE,
`Year` FLOAT,
`Month` TEXT,
Avg_Weekday_Trips DECIMAL(2)
);

-- Select all data
select * from ridership;