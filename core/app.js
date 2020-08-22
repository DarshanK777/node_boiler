// 3rd party imports
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var cors = require('cors')
const io = require('socket.io').listen(server)

//routes
const userRoutes = require('../routes/user')
const authRoutes = require('../routes/auth')

const connection = require('../chat/connections')
// Middleware to enable CORS in expressjs 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//setting cors and parser for express
app.use(cors())
app.use(bodyParser.json())

// routes
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

//connecting to db
mongoose.connect( 'mongodb://localhost:27017/projectAlpha' , { useNewUrlParser: true, useUnifiedTopology: true }, ()=>{
    console.log('db connected')
})

connection(io)
// server up and running
server.listen(4000, ()=>console.log("server up and running  at 4000"))