<<<<<<< HEAD
const express = require('express')
, router = express.Router()
, mongoose = require('mongoose')

/*
* Database Model
*/

const Post = require('../models/post')
/*
* Routing
*/

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main.handlebars'
    req.app.locals.isLogin = req.flash('isLogin')
    next()
  })
router.get('/', (req, res) => {
    Post.find({})
    .sort({dateCreate: -1})
    .limit(6)
    .then(results => {
        let result = []
        for(var i = 0; i < results.length; i++) {
            let imgOpenTag = results[i].body.toString().search('<img')
            let imgCloseTag = results[i].body.toString().search('/>')
            result.push({
             _id: results[i]._id,
             title: results[i].title,
            img: results[i].body.toString().slice(imgOpenTag, imgCloseTag +2)
            })
        }
        res.status(200).render('assets/home',
        {
        layout: 'main.handlebars',
        results: result,
        user: req.user
        })
    })
    .catch(err => {error: err })
})

router.get('/post/:id', (req, res) => {
    Post.findOne({
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
        console.log(err)
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
=======
const express = require('express')
, router = express.Router()
, mongoose = require('mongoose')

/*
* Database Model
*/

const Post = require('../models/post')
/*
* Routing
*/

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'main.handlebars'
    req.app.locals.isLogin = req.flash('isLogin')
    next()
  })
router.get('/', (req, res) => {
    Post.find({})
    .sort({dateCreate: -1})
    .limit(6)
    .then(results => {
        let result = []
        for(var i = 0; i < results.length; i++) {
            let imgOpenTag = results[i].body.toString().search('<img')
            let imgCloseTag = results[i].body.toString().search('/>')
            result.push({
             _id: results[i]._id,
             title: results[i].title,
            img: results[i].body.toString().slice(imgOpenTag, imgCloseTag +2)
            })
        }
        res.status(200).render('assets/home',
        {
        layout: 'main.handlebars',
        results: result,
        user: req.user
        })
    })
    .catch(err => {error: err })
})

router.get('/post/:id', (req, res) => {
    Post.findOne({
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
        console.log(err)
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
router.get('/register', /* isAuth = Uncomment after editing ,*/ (req, res) => {
    res.render('admin/register')
  })
  
>>>>>>> 8f83c5f5f46b58c18d1463749d84121efec767b3
module.exports = router