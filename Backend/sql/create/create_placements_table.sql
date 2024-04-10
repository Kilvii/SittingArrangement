-- Active: 1711300450065@@127.0.0.1@5432@arrangement@public
DROP TABLE IF EXISTS placements;

CREATE TABLE placements
(
    id SERIAL PRIMARY KEY,
    room_id INT,
    number_of_seats INT,
    available_seats INT 
);