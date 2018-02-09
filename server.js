/**
 * @license Copyright (c) Radio Astronomy Group 2018 All rights reserved.
 * 
**/

    'use strict'

require('dotenv').config()

const express = require('express')
    ,  path = require('path')
    ,  exphbs = require('express-handlebars')
    ,  bodyParser = require('body-parser')
    ,  session = require('express-session')
    ,  passport = require('passport')
    ,  LocalStrategy = require('passport-local').Strategy
    ,  flash = require('connect-flash')
    ,  expressValidator = require('express-validator')
    ,  mongoose = require('mongoose')
    ,  mongo = require('mongodb')
    ,  app = express()


    const home = require('./routes/home'),
    admin = require('./routes/admin')

mongoose.connect(`${process.env.DB_HOST}/testOnlyDbs`)
.then((result => console.log('Connected to mongoDB')))
.catch((error => console.log(`Error: ${error}`)))
// Passport
app.use(passport.initialize())
app.use(passport.session())
// Handlebars middleware
app.engine('handlebars', exphbs({layoutsDir: __dirname + '/views/layouts'}))
app.set('view engine', 'handlebars')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))
// Express session
app.use(session({
  secret: 'mysecret',
  resave: true,
  saveUninitialized: true,
}))
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    const namespace = param.split('.'),
          root = namespace.shift(),
          formParam = root;
    while(namespace.length){
      formParam += `[${namespace.shift()}]`
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    }      
  }
}))
// Express Message || Connect-FLash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('/', (req, res) => {
  res.redirect('/home')
})
app.use('/admin', admin)
app.use('/home', home)
app.use(function (req, res, next){
  const error = new Error('Not Found')
  error.status = 404;
  res.status(error.status || 500)
  .render('assets/error',{
    layout: '',
    error: error
  })
})
// Connect to port
const port = process.env.DB_PORT || 8000
app.listen(port, () => console.log(`Connected to port ${port}`))