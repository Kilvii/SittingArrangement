var express = require('express');
var router = express.Router();
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM placements')
        res.status(200).send({
            message: "Successfully get all placements",
            children: data.rows
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await pool.query('SELECT * FROM placements WHERE id=$1', [id])
        res.status(200).send({
            message: "Successfully get placement by id",
            children: data.rows
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/create', async (req, res) => {
    try {
        await pool.query("CREATE TABLE placements ( id SERIAL PRIMARY KEY, venue TEXT, room_id INT, people_at_desk INT, number_of_tables INT, available_seats INT);");

        res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/store', async (req, res) => {
    try {
        const { venue, room_id, people_at_desk, number_of_tables, available_seats } = req.body
        await pool.query('INSERT INTO placements (venue, room_id, people_at_desk, number_of_tables, available_seats) VALUES ($1, $2, $3, $4, $5)',
            [venue, room_id, people_at_desk, number_of_tables, available_seats])
        res.status(200).send({
            message: `Successfully added placement`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/drop', async (req, res) => {
    try {
        await pool.query("DROP TABLE IF EXISTS placements;");

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { venue, room_id, people_at_desk, number_of_tables, available_seats } = req.body
        const id = req.params.id
        await pool.query('UPDATE placements SET venue = $1, room_id = $2, people_at_desk = $3, number_of_tables = $4, available_seats = $5 WHERE id = $6',
            [venue, room_id, people_at_desk, number_of_tables, available_seats, id])
        res.status(200).send({
            message: `Successfully updated placement with id ${id}`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await pool.query('DELETE FROM placements WHERE id = $1',
            [id])

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;
