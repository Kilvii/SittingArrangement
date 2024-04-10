const express = require("express")
const port = 3000

var placementRouter = require('./routes/placements');
var usersRouter = require('./routes/users');

const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use('/api/placements', placementRouter)
app.use('/api/users', usersRouter)

app.listen(port, () => {
    console.log(`Server has started on port: ${port}`)
})

// module.exports = app;
