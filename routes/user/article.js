const express = require('express')
    , router = express.Router()
    , RequestArticle = require('../../models/RequestArticle')
    
// Get Specific Request Article
router.get('/article/:id', (req, res) => {
  RequestArticle
  .findById(req.params.id)
  .then(docs => {
    res.render('user/post', {docs})
  })
})

module.exports = router;    