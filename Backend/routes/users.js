var express = require('express');
var router = express.Router();
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM users')
    res.status(200).send({
      message: "Successfully get all users",
      children: data.rows
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.post('/store', async (req, res) => {
  try {
    const { surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number } = req.body
    const result = await pool.query('INSERT INTO users (surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id',
      [surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number])

    const userId = result.rows[0].id
    const userData = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
    const userDataSchool = userData.rows[0].school
    const placements = await pool.query('SELECT * FROM placements') //placements.rows - get all


    
    console.log(placements.rows)

    res.status(200).send({
      message: `Successfully added user`,
      user: userData.rows[0]
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.get('/:id', async (req, res) => {
  try {
      const user_id = req.params.id
      const data = await pool.query('SELECT * FROM users WHERE id=$1', [user_id])
      res.status(200).send({
          message: "Successfully get user",
          children: data.rows
      })
  } catch (err) {
      console.log(err)
      res.sendStatus(500)
  }
})

module.exports = router;
