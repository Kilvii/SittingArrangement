const express = require("express")

var loggingRouter = require('./routes/logging');
var placementRouter = require('./routes/placements');
var participantsRouter = require('./routes/participants');
var organizersRouter = require('./routes/organizers');
var interfaceAccessRouter = require('./routes/interface_access');
var venuesRouter = require('./routes/venues');

const port = 3000; 

const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use('/api/logging', loggingRouter)
app.use('/api/placements', placementRouter)
app.use('/api/organizers', organizersRouter)
app.use('/api/participants', participantsRouter)
app.use('/api/venues', venuesRouter)
app.use('/api/interface_access', interfaceAccessRouter)

app.listen(port, () => {
    console.log(`Server has started`)
})

