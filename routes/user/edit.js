const express = require('express')
    , router = express.Router()
    , RequestArticle = require('../../models/RequestArticle')


// Routing if they need to edit their article.
router.get('/article/edit/:id', (req, res) => {
  RequestArticle.findById(req.params.id).then(docs => {
    res.render('user/update',
     {
      _id: docs._id,
      title: docs.title,
      body: docs.body
    })
  })
})

router.post('/article/edit/:id', (req, res) => {
  RequestArticle.findById(req.params.id, (err, docs) => {
    if(err) throw err;
    docs.set({
      title: req.body.title,
      body: req.body.body
    })
    docs.save((err, updatedArticle) => {
      if(err) throw err;
      res.redirect('/user/article/'+req.params.id)
    })
  })
})

router.delete("/article/delete/:id", (req, res) => {
  let id = req.params.id;
  RequestArticle.remove({
    _id: id
  }, function(err) {
    if(err) throw err;
    res.send('Success')
  })
});


module.exports = router;    