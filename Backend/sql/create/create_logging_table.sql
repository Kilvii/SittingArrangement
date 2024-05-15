-- Active: 1711300450065@@127.0.0.1@5432@arrangement@public
DROP TABLE IF EXISTS logging;

CREATE TABLE logging
(
    id SERIAL PRIMARY KEY,
    organizer_id INT,
    log_message TEXT
);