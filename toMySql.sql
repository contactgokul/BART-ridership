-- Create and use bart_db
-- DROP DATABASE IF EXISTS bart_db;
CREATE DATABASE bart_db;
USE bart_db;

-- Create ridership table for raw data to be loaded into
CREATE TABLE ridership (
ID FLOAT PRIMARY KEY,
Entry_Station TEXT,
Exit_Station TEXT,
Yr_Mo DATE,
`Year` FLOAT,
`Month` TEXT,
Avg_Weekday_Trips DECIMAL(2)
);

-- Create metadata table for raw data to be loaded into 
CREATE TABLE metadata (
ID float primary key,
abbr text,
address text,
city text,
county text,
gtfs_latitude float,
gtfs_longitude float,
`name` text,
state text,
zipcode text,
abbr2 text
);

-- Select all data
select * from ridership;
select * from metadata;