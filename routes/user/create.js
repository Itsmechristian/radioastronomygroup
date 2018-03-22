const express = require('express')
    , router = express.Router()
    , mongoose = require('mongoose')
    , RequestArticle = require('../../models/RequestArticle')
    , Article = require('../../models/Article')
    , Events = require('../../models/Events')

router.get('/create/events', (req, res) => {
  Events.find({}).sort([['isodate', 1]]).then(event => {
    const event2018 = event.filter(e => (e.year === '2018'))
    const event2019 = event.filter(e => (e.year === '2019'))
    const event2020 = event.filter(e => (e.year === '2020'))
    res.render('user/events', {
      event2018,
      event2019,
      event2020
    })
  })
})

router.post('/create/events', (req, res) => {
  const place = req.body.place,
        fullDate = req.body.fulldate,
        description = req.body.description
  const Event = new Events({
      place,
      isodate: new Date(fullDate),
      year: dateFormat.getYear(fullDate),
      subdate: {
        day: dateFormat.getDay(fullDate),
        month: dateFormat.getMonth(fullDate),
        date: dateFormat.getDate(fullDate),
      },
      description,
  })
  Event
  .save()
  .then(saved => {
    req.flash('success', 'Upcoming event created succcesfully')
    res.redirect('/user/create/events')
  })      
  .catch(err => console.log(err))
})
// Creating new request Article
router.get("/create/article", (req, res) => {
  RequestArticle.find().then(docs => {
    if(docs.length < 5) {
      res.render("user/create")
    }
    else{
      req.flash('error', 'Request Limit Exceeded')
      res.redirect('/user')
    }
  })
});

router.post("/create/article", (req, res) => {
  let title = req.body.title
    , body = req.body.body

  req.checkBody('title', 'Title cannot be empty').notEmpty()
  req.checkBody('body', 'Body cannot be empty').notEmpty()

  req.asyncValidationErrors()
  .then(result => {
    let newArticle = new RequestArticle({
      _id: new mongoose.Types.ObjectId(),
      userId: req.user._id,
      title,
      body,
      requestBy: req.user.firstname +' '+req.user.lastname
    })
    newArticle.save(err => {
      if(err){ 
        res.status(500).redirect('/user/create')
      }
      else{
        res.status(200).redirect('/user')
      }
    })
  })
  .catch(err => {
    res.render('user/create', {
      errors: err,
      title,
      body
    })
  })
});

router.delete('/delete/event/:id', (req, res) => {
  let id = req.params.id;
  Events.remove({
    _id: id
  }, err => {
    if(err) throw err;
    res.send('success')
  })
})

router.delete('/finish/event/:id', (req, res) => {
  let id = req.params.id;
  Events.remove({
    _id:id
  }, err => {
    if(err) throw err;
    res.send('success')
  })
})

module.exports = router;