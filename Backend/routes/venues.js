var express = require('express');
var router = express.Router();
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM venues')
        res.status(200).send({
            message: "Successfully get all venues",
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
        const data = await pool.query('SELECT * FROM venues WHERE id=$1', [id])
        res.status(200).send({
            message: "Successfully get venue by id",
            children: data.rows
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/create', async (req, res) => {
    try {
        await pool.query("CREATE TABLE venues ( id SERIAL PRIMARY KEY, venue TEXT);");
    
        res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/store', async (req, res) => {
    try {
        const { venue } = req.body
        await pool.query('INSERT INTO venues (venue) VALUES ($1)',
            [venue])
        res.status(200).send({
            message: `Successfully added venue`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/drop', async (req, res) => {
    try {
        await pool.query("DROP TABLE IF EXISTS venues;");

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { venue } = req.body
        const id = req.params.id
        await pool.query('UPDATE venues SET venue = $1 WHERE id = $2',
            [venue, id])
        res.status(200).send({
            message: `Successfully updated venue with id ${id}`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await pool.query('DELETE FROM venues WHERE id = $1',
            [id])

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;