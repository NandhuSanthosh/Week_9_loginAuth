require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const contentRoutes = require('./routes/contentRoutes.js');
const admingRoutes = require('./routes/admingRoutes')
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser')
const app = express();

// app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
          

app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use('/', authRoutes)
app.use('/', contentRoutes)
app.use('/admin', admingRoutes)


mongoose.connect(process.env.DB_CONNECTION_STRING)
.then( ()=>{
  console.log("Sucessfully connected to database");
})
.catch( (err)=>{
  console.log(err.message)
})


app.listen(3000, ()=>{
  console.log("Server up at port 3000")
})