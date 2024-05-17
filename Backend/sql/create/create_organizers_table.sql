-- Active: 1711300450065@@127.0.0.1@5432@arrangement@public
DROP TABLE IF EXISTS organizers;

CREATE TABLE organizers
(
    id SERIAL PRIMARY KEY,
    surname TEXT,
    firstname TEXT,
    patronymic TEXT,
    faculty TEXT,
    student_group INT,
    venue TEXT DEFAULT "Не указано",
    email TEXT,
    password TEXT
    );