const express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , multer = require('multer')
  , path = require('path')
  , fs = require('fs')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , expressValidator = require('express-validator')
  , flash = require('connect-flash')

/*
* Set Storage Engine
*/

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname+Date.now()+path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
}).any()

const Post = require('../models/post')
      User = require('../models/user')

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin.handlebars'
  next()
})
router.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.success = req.flash('errors')
  next()
})
/* Auth Routing */
router.get('/register', (req, res) => {
  res.render('admin/register')
})
router.post('/register', (req, res) => {
  let username = req.body.username.toLowerCase()
    , firstname = req.body.firstname.toLowerCase()
    , lastname = req.body.lastname.toLowerCase()
    , email = req.body.email.toLowerCase()
    , password = req.body.password
    , password2 = req.body.password2
  
    // Form Validator
    req.checkBody('username', 'Username field is cannot be empty').notEmpty()
    req.checkBody('username', 'Username is already taken').isUsernameAvailable()
    req.checkBody('username', 'Username must be between 4-15 characters long').len(4, 15)
    req.checkBody('firstname', 'Your first name is required').notEmpty()
    req.checkBody('lastname', 'Your last name is required').notEmpty()
    req.checkBody('email', 'Email field is required').notEmpty()
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again').len(4, 100)
    req.checkBody('email', 'Email is already exists').isEmailAvailable()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password2', 'Confirm your password').notEmpty()
    req.checkBody('password2', 'Password do not match').equals(password)
    
    // Check Errors
    req.asyncValidationErrors()
    .then(result => {
      let newUser = new User({
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
          })
          User.createUser(newUser, (err, user) => {
            if(err) throw err;
            else{
              req.flash('success', 'Succesfully create')
              res.location('/')
              res.redirect('/admin')
            }
          })
    })
    .catch(error => {
            res.render('admin/register', {
          form: {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
          },
          errors: error
        })
    })
})

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(new LocalStrategy((username, password, done) => {
  User.getUserbyUsername(username.toLowerCase(), (err, user) => {
    if(err) throw err;
    if(!user){
      return done(null, false, {
        message: 'Unknown User'
      })
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) return done(err);
      if(isMatch) {
        return done(null. user)
      }
      else {
        return done(null, false, { message: 'Invalid Password'})
      }
    })
  })
}))

router.get('/login', (req, res) => {
  res.render('admin/login', {layout: 'main.handlebars', error: req.flash('error')})
})

router.post('/login', passport.authenticate('local', {successRedirect: '/admin', failureRedirect: '/admin/login', failureMessage: 'Invalid username or password', failureFlash: true}), (req, res) => {
    req.flash('success', 'You are now logged in')
    res.redirect('/admin')
  }
)

/* Admin Routing */


router.get('/', (req, res) => {
  res.render('admin/panel')
})

router.get('/create', (req, res) => {
  res.render('admin/create', {
  })
})

router.post('/create', upload,(req, res) => {
    const newPost = new Post({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    body: req.body.body
  })
  newPost.save()
.then(result => {
  res.status(201).json({
    message: 'Created Succesfully',
    createdPost: {
      _id: result._id,
      title: result.title,
      body: result.body,
    }
  })
})
})

router.get('/edit', (req, res) => {
  Post.find()
  .then(results => {
  res.render('admin/edit', { results: results })
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/edit/:id', (req, res) => {
  let id = req.params.id
  Post.findById(id)
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    console.log(err)
  })
})

router.delete('/edit/delete/:id', (req, res) => {
  let id = req.params.id
  Post.remove({
    _id: id
  })
  .then(() => {
    res.redirect('/admin/edit')
  })
})
module.exports = router