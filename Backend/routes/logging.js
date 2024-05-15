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

router.get('/:organizer_id', async (req, res) => {
    try {
        const organizer_id = req.params.organizer_id
        const data = await pool.query('SELECT * FROM logging WHERE organizer_id=$1', [organizer_id])
        res.status(200).send({
            message: "Successfully get ogranizer logs",
            children: data.rows
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router;