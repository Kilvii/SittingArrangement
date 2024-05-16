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

module.exports = router;