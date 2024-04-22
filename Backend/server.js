const express = require("express")

var placementRouter = require('./routes/placements');
var usersRouter = require('./routes/users');

const port = 3000; 

const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use('/api/placements', placementRouter)
app.use('/api/users', usersRouter)

app.listen(port, () => {
    console.log(`Server has started`)
})

