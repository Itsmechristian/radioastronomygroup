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
    req.app.locals.layout = 'admin.handlebars'
    next()
  })
router.get('/', (req, res) => {
    Post.find({}, null, {sort: {dateCreate: -1}})
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
        results: result
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
           result: results
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

module.exports = router