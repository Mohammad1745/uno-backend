const express = require('express')
const app = express()
const http = require('http')
const server = 5000
const PORT = process.env.PORT || 8000
const cors = require('cors')

app.use(cors())
app.use(express.static('public'))

require('dotenv').config()
require('./service_providers/broadcast_service_provider')(server)
require('./service_providers/route_service_provider')(app, express)

app.listen(PORT, () => console.log(`Server Running on ${PORT}`))