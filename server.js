/**
 * @license Copyright (c) Radio Astronomy Group 2018 All rights reserved.
 * 
**/

    'use strict'

require('dotenv').config()


const express = require('express')
    , path = require('path')
    , exphbs = require('express-handlebars')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , MongoStore = require('connect-mongo')(session)
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , flash = require('connect-flash')
    , expressValidator = require('express-validator')
    , mongoose = require('mongoose')
    , mongo = require('mongodb')
    , methodOverride = require('method-override')
    

    // Invoke an instance of express application
    , app = express()

    const User = require('./models/User')

// Mongoose Middleware help you to connect in mongodb

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  "auth": {
    "authSource": "admin"
  },
  "user": `${process.env.DB_USERNAME}`,
  "pass": `${process.env.DB_PASSWORD}`
})
.then((result => console.log('Connected to mongoDB')))
.catch((error => console.log(error)))


// Express Handlebars middlware register .handlebars layouts
app.engine('handlebars', exphbs({layoutsDir: __dirname + '/views/layouts'}))
app.set('view engine', 'handlebars')


// Initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Initialize directory to join in url
app.use(express.static(path.join(__dirname, 'public')))

// Initialize express-session to allow us track the logged in user across sessions.
app.use(session({
  secret: 'askdmaskdkasndksa',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000
  }
}))

// Initialize passport to make a user logged in and get user info to req.user
app.use(passport.initialize())
app.use(passport.session())

// Validate Errors if something error happening.
app.use(expressValidator({
  customValidators: {
    // Check database if username is available and give an error flash if i isn't
    isUsernameAvailable: (username) => {
      return new Promise((resolve, reject) => {
        User.findOne({ username : username }, (err, res) => {
          if(err) throw err
          if(res == null) {
              resolve(err)
          }
          else{
            reject(res)
          }
        })
      })
    },
    // Check database if email is available and give an error flash if i isn't
    isEmailAvailable: (email) => {
      return new Promise((resolve, reject) => {
        User.findOne({ email : email }, (err, res) => {
          if(err) throw err
          if(res == null) {
              resolve(err)
          }
          else{
            reject(res)
          }
        })
      })
    }
  },
  // Format errors to make it easier to access it.
  errorFormatter: (param, msg) => {
    const namespace = param.split('.'),
          root = namespace.shift(),
          formParam = root;
    while(namespace.length){
      formParam += `[${namespace.shift()}]`
    }
    return{
      from: formParam,
      msg: msg,
    }      
  }
}))


// Initialize flash messages allow us to access a success or an error message to req.flash(body, message)
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Initialize method override to help us POST and DELETE
app.use(methodOverride('_method'))

// Redirct router to home by default
app.get('/', (req, res) => {
  res.redirect('/home')
})
app.get('*', (req, res, next) => {
  req.app.locals.error = req.flash('error')
  res.app.locals.user = req.user;
  next()
})

/* Routers */
const home = require('./routes/home')
    , panel = require('./routes/user/panel')
    , article = require('./routes/user/article')
    , create = require('./routes/user/create')
    , edit = require('./routes/user/edit')
    , upload = require('./routes/user/upload')
    , subpages = require('./routes/subpages')
    , publish = require('./routes/admin/publish')
// Configure routings
app.use('/home', home)
app.use('/pages', subpages)

app.use('/user',(req, res, next) => {
  res.app.locals.success = req.flash('success')
  // Check the session and Check if there is a user for security reaseon
 if(req.session && req.user) {
     req.app.locals.layout = "main.handlebars";
     req.session.user = req.user;
      global.username = req.user.username;
   next()
 }
 else{
   req.flash('error', 'Log in to continue');
   res.redirect('/home/login')
 }
})

app.use('/user', panel)
app.use('/user', article)
app.use('/user', create)
app.use('/user', edit)
app.use('/user', upload)

app.use('/admin', (req, res, next) => {
  if(req.session && req.user && req.user.admin) {
    res.app.locals.layout = 'main.handlebars';
  next()
  }
  else{
    if(req.user) {
      req.flash('error', 'You should be an administrator')
      res.redirect('/user')
    }
    else{
      req.flash('error', 'Log in to continue');
      res.redirect('/home/login')
    }
  }
})

app.use('/admin', publish)
// Render to 404 pages if the page doesn't exist
app.use(function (req, res, next){
  const error = new Error('Not Found')
  error.status = 404;
  res.status(error.status || 500)
  .render('home/error',{
    layout: '',
    error: error
  })
})

// Application port
const port = process.env.PORT || 8000

// start the express server
app.listen(port, () => console.log(`Connected to port ${port}`))