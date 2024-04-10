-- Active: 1711300450065@@127.0.0.1@5432@arrangement@public
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    surname TEXT,
    firstname TEXT,
    patronymic TEXT,
    gender BOOLEAN, 
    birthdate DATE,
    age INT,
    phone TEXT, 
    email TEXT,
    school TEXT,
    address TEXT,
    classroom INT,
    subject TEXT,
    citizenship TEXT,
    passport_series INT,
    passport_number INT
);