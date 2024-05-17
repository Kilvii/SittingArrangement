-- Active: 1711300450065@@127.0.0.1@5432@arrangement@public
DROP TABLE IF EXISTS placements;

CREATE TABLE placements
(
    id SERIAL PRIMARY KEY,
    venue TEXT,
    room_id INT,
    people_at_desk INT,
    number_of_tables INT,
    available_seats INT
);