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

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await pool.query('SELECT * FROM organizers WHERE id=$1', [id])
        res.status(200).send({
            message: "Successfully get organizer by id",
            children: data.rows
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.get('/check/:email&:password', async (req, res) => {
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

router.post('/create', async (req, res) => {
    try {
        await pool.query("CREATE TABLE organizers ( id SERIAL PRIMARY KEY, surname TEXT, firstname TEXT, patronymic TEXT, faculty TEXT, student_group INT, venue TEXT DEFAULT 'Не указано', email TEXT, password TEXT );");

        res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

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

router.post('/drop', async (req, res) => {
    try {
        await pool.query("DROP TABLE IF EXISTS organizers;");

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { surname, firstname, patronymic, faculty, student_group, venue, email, password } = req.body
        const id = req.params.id
        await pool.query('UPDATE organizers SET surname = $1, firstname = $2, patronymic = $3, faculty = $4, student_group = $5, venue = $6, email = $7, password = $8 WHERE id = $9',
            [surname, firstname, patronymic, faculty, student_group, venue, email, password, id])
        res.status(200).send({
            message: `Successfully updated organizer with id ${id}`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await pool.query('DELETE FROM organizers WHERE id = $1',
            [id])

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;