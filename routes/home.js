const express = require('express')
, router = express.Router()
, mongoose = require('mongoose')
, path = require('path')
, passport = require('passport')
, LocalStrategy = require('passport-local').Strategy
, expressValidator = require('express-validator')
, flash = require('connect-flash')
/*
* Database Model
*/
    const Article = require('../models/article')
        , User = require('../models/user')


    const getDate = require('../config/getdate')
/*
* Routing
*/
    
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main.handlebars'
    req.app.locals.isLogin = req.flash('isLogin')
    next()
  })
router.get('/', (req, res) => {
    Article.find({})
    .sort({dateCreate: -1})
    .limit(6)
    .then(results => {
        articles = []
        results.forEach((result) => {
            let imgOpenTag = result.body.search('<img')
              , imgCloseTag = result.body.search('/>')
              , img = result.body.toString().slice(imgOpenTag, imgCloseTag + 2)
              , src = img.match(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i)
              function trancateTitle(title) {
                if(title.length > 100) {
                    return title = title.substring(0, 100)+'...'
                }
                return title
              }  
              
              if(src) {
                   articles.push({
                       _id: result._id,
                       title: trancateTitle(result.title),
                       src: src[0] || src[1]
                   })
                }
                else{
                    articles.push({
                        _id: result._id,
                        title: result.title.substring(0, 100),
                        src: 'https://www.drbrownstein.com/wp-content/uploads/2017/03/500x500.png'
                    })
                }
            })
        res.status(200).render('assets/home',
        {
        articles: articles,
        layout: 'main.handlebars',
        user: req.user,
        date: getDate.getdate
        })
    })
    .catch(err => {error: err })
})

router.get('/post/:id', (req, res) => {
    Article.findOne({
        _id: req.params.id
    })
    .then(results => {
       res.render('assets/post', {
           layout: 'main.handlebars',
           post: results
       })
    })
    .catch(err => {
        res.render('assets/post', {
            layout: 'main.handlebars',
            error: err
        })
    })
})

router.get('/login', (req, res) => {
    if(!req.user) {

        res.render('admin/login', 
        {
        layout: 'main.handlebars',
        success: req.flash('success'),
        notauth: req.flash('notauth'),
        error: req.flash('error'),
        user: req.user
    })
    } 
    else{
        req.flash('isLogin', 'Already logged in')
        res.redirect('/admin')
    }
})
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
    req.checkBody('username', 'Username field cannot be empty').notEmpty()
    req.checkBody('username', 'Username is already taken').isUsernameAvailable()
    req.checkBody('username', 'Username must be at least 4 characters long').len(4)
    req.checkBody('firstname', 'Your first name is required').notEmpty()
    req.checkBody('lastname', 'Your last name is required').notEmpty()
    req.checkBody('email', 'Email field is required').notEmpty()
    req.checkBody('email', 'Invalid Email').isEmail()
    req.checkBody('email', 'Email address must be at least 3 characters long').len(3)
    req.checkBody('email', 'Email is already exists').isEmailAvailable()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password', 'Password should be at least 8 characters').len(8)
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
            req.flash('success', 'Succesfully create you can now log in')
            res.location('/')
            res.redirect('/home/login')
            }
        })
    })
    .catch(errors => {
    const usernameError = errors.filter(error => (error.from === 'username'))
    , firstnameError = errors.filter(error => (error.from === 'firstname'))
    , lastnameError = errors.filter(error => (error.from === 'lastname')) 
    , emailError = errors.filter(error => (error.from === 'email'))  
    , passwordError = errors.filter(error => (error.from === 'password'))
    , password2Error = errors.filter(error => (error.from === 'password2'))
       res.render('admin/register', {
        errorforms: {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        },
        usernameError,
        firstnameError,
        lastnameError,
        emailError,
        passwordError,
        password2Error
        })
    })
})


module.exports = router