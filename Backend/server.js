const express = require("express")
const pool = require('./db')
const port = 3000

const app = express()
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.post('/createPlacement', async (req, res) => {
    try{
       await pool.query('CREATE TABLE placements (id SERIAL PRIMARY KEY, place_number INT, number_of_seats INT, available_seats INT)',
        [place_number, number_of_seats, available_seats])
        res.status(200).send({
            message: "Successfully create table called: placement"
        })
    } catch (err){
       console.log(err)
       res.sendStatus(500)
    }
})

app.post('/addPlacement', async (req, res) => {
    try{
       await pool.query('INSERT INTO placements (place_number, number_of_seats, available_seats) VALUES ($1, $2, $3)',
        [place_number, number_of_seats, available_seats])
        res.status(200).send({
            message: "Successfully added placement"
        })
    } catch (err){
       console.log(err)
       res.sendStatus(500)
    }
})

app.get('/getAllPlacements', async (req, res) => {
     try{
        const data = await pool.query('SELECT * FROM placements')
        res.status(200).send({
            message: "Successfully get all placements",
            children: data.rows       
        })
    } catch (err){
        console.log(err)
        res.sendStatus(500)
     }
})

app.get('/getPlacementByPlaceNumber', async (req, res) => {
    try{
       const data = await pool.query('SELECT * FROM placements WHERE place_number=$1', [place_number])
       res.status(200).send({
           message: "Successfully get all placements",
           children: data.rows       
       })
   } catch (err){
       console.log(err)
       res.sendStatus(500)
    }
})


app.listen(port, () => console.log(`Server has started on port: ${port}`))

