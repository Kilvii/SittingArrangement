var express = require('express');
var router = express.Router();
const pool = require('../db')

router.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM interface_access')
        res.status(200).send({
            message: "Successfully get all users who have interface_access",
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
        const data = await pool.query('SELECT * FROM interface_access WHERE id=$1', [id])
        res.status(200).send({
            message: "Successfully get user who have interface_access by id",
            children: data.rows
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/create', async (req, res) => {
    try {
        await pool.query("CREATE TABLE interface_access ( id SERIAL PRIMARY KEY, login TEXT, password TEXT);");
    
        res.sendStatus(201)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/store', async (req, res) => {
    try {
        const { login, password } = req.body
        await pool.query('INSERT INTO interface_access (login, password) VALUES ($1, $2)',
            [login, password])
        res.status(200).send({
            message: `Successfully added users who have interface_access`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/drop', async (req, res) => {
    try {
        await pool.query("DROP TABLE IF EXISTS interface_access;");

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { login, password } = req.body
        const id = req.params.id
        await pool.query('UPDATE interface_access SET login = $1, password = $2 WHERE id = $3',
            [login, password, id])
        res.status(200).send({
            message: `Successfully updated user who have interface_access with id ${id}`
        })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await pool.query('DELETE FROM interface_access WHERE id = $1',
            [id])

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;