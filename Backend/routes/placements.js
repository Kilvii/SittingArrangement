var express = require('express');
var router = express.Router();
const pool = require('../db')

router.post('/store', async (req, res) => {
  try {
      const { room_id, number_of_seats, available_seats } = req.body
      await pool.query('INSERT INTO placements (room_id, number_of_seats, available_seats) VALUES ($1, $2, $3)',
          [room_id, number_of_seats, available_seats])
      res.status(200).send({
          message: `Successfully added placement`
      })
  } catch (err) {
      console.log(err)
      res.sendStatus(500)
  }
})

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

router.get('/:room_id', async (req, res) => {
  try {
      const room_id = req.params.room_id
      const data = await pool.query('SELECT * FROM placements WHERE room_id=$1', [room_id])
      res.status(200).send({
          message: "Successfully get placement",
          children: data.rows
      })
  } catch (err) {
      console.log(err)
      res.sendStatus(500)
  }
})

module.exports = router;
