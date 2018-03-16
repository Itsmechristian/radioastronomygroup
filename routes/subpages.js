const express = require('express')
    , router = express.Router()
    , mongoose = require('mongoose')


router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'main.handlebars'
  next()
})

router.get('/radioastronomy/getting-started', (req, res) => {
  res.render('subpages/radioastronomy/getting-started')
})

router.get('/radioastronomy/radiospectrum', (req, res) => {
  res.render('subpages/radioastronomy/radiospectrum')
})

router.get('/radioastronomy/'+encodeURIComponent('VLF Solar'), (req, res) => {
  res.render('subpages/radioastronomy/vlfsolar')
})

router.get('/radioastronomy/magnetometry', (req, res) => {
  res.render('subpages/radioastronomy/magnetometry')
})

router.get('/radioastronomy/'+encodeURIComponent('Simple Radio Astronomy') , (req, res) => {
  res.render('subpages/radioastronomy/simpleradioastronomy')
})

router.get('/radioastronomy/'+encodeURIComponent('Radio Jove'), (req, res) => {
  res.render('subpages/radioastronomy/radiojove')
})
module.exports = router