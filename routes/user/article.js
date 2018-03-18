const express = require('express')
    , router = express.Router()
    , Article = require('../../models/Article')
    , RequestArticle = require('../../models/RequestArticle')
    , dataFormat = require('../../module/dateFormat')
    
router.get('/articles', (req, res) => {
    RequestArticle.find({userId: req.user.id}).then(docs => {
      const response = docs.map(e => {
        return {
          _id: e._id,
          title: e.title.substring(0, 200)+'...',
          datecreated: dateFormat.fullDate(e.dateRequested)
        }
      })
      res.render('user/articles', {articles: response})
    })
})

router.get('/articles/published', (req, res) => {
  Article.find({userId: req.user.id}).sort([['datePublished', 'desc']]).then(docs => {
    const response = docs.map(e => {
      return {
        _id: e._id,
        title: e.title.substring(0, 200)+'...',
        datecreated: dateFormat.fullDate(e.dateRequested)
      }
    })
    res.render('user/articles', {articles: response})
  })
})
// Get Specific Request Article
router.get('/article/:id', (req, res) => {
    RequestArticle
    .findById(req.params.id)
    .then(docs => {
      if(docs.userId === req.user.id) {
        res.render('user/post', {docs})
      }
      else{
        res.redirect('/user')
      }
    })
  })
router.get('/articles/published/:id', (req, res) => {
  Article.findById(req.params.id)
  .then(docs => {
    if(docs.userId === req.user.id) {
      res.render('user/post', {docs})
    }
    else{
      res.redirect('/user')
    }
  })
})  

module.exports = router;    