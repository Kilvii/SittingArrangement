var express = require('express');
var router = express.Router();
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM logging')
        res.status(200).send({
            message: "Successfully get all logs",
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
        const data = await pool.query('SELECT * FROM logging WHERE id=$1', [id])
        res.status(200).send({
            message: "Successfully get log by id",
            children: data.rows
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/create', async (req, res) => {
    try {
        await pool.query("CREATE TABLE logging ( id SERIAL PRIMARY KEY, log_message TEXT);");
    
        res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/store', async (req, res) => {
    try {
        const { log_message } = req.body
        await pool.query('INSERT INTO logging (log_message) VALUES ($1)',
            [log_message])
        res.status(200).send({
            message: `Successfully added log`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/drop', async (req, res) => {
    try {
        await pool.query("DROP TABLE IF EXISTS logging;");

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;