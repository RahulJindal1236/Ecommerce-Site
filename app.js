// Imports
const express = require('express')
const path = require('path')
const ejs = require('ejs')
const session = require('express-session')
require('dotenv').config({ path: './.env' })
const db = require('./model/db')

// variables
const port = 3000

// Inilializing app
const app = express()
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

// Connecting with database
db.start.connect(function (err) {
  if (err) {
    console.log('Error connecting to the database')
  } else {
    console.log('Connected to MYSQL')
  }
})

// Establishing Sessions
app.use(
  session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: Number(process.env.SESSION_LIFETIME),
      originalMaxAge: 1000 * 60 * 30,
      sameSite: true,
      secure: false,
    },
  })
)

// Routing
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))
app.use('/products', require('./routes/products'))
app.use('/admin', require('./routes/admin'))

// Server Start
app.listen(port)
