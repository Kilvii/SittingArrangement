var express = require('express');
var router = express.Router();
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM organizers')
        res.status(200).send({
            message: "Successfully get all organizers",
            children: data.rows
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/store', async (req, res) => {
    try {
        const { surname, firstname, patronymic, faculty, student_group, email, password } = req.body
        await pool.query('INSERT INTO organizers (surname, firstname, patronymic, faculty, student_group, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [surname, firstname, patronymic, faculty, student_group, email, password])
        res.status(200).send({
            message: `Successfully added organizer`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.get('/:email&:password', async (req, res) => {
    try {
        const email = req.params.email
        const password = req.params.password

        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required' });
        }

        const result = await pool.query({
            text: 'SELECT * FROM organizers WHERE email=$1 AND password=$2',
            values: [email, password]
        });

        if (result.rowCount === 0) {
            return res.status(404).send({ message: 'Organizer not found' });
        }

        res.status(200).send({
            message: 'Successfully got organizer',
            organizer: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;