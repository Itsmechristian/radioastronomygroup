const express = require('express')
    , router = express.Router()
    , mongoose = require('mongoose')


router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'subpages.handlebars'
  next()
})

router.get('/radioastronomy/getting-started', (req, res) => {
  res.render('subpages/radioastronomy/getting-started')
})

module.exports = router