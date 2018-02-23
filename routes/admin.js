const express = require('express')
    , router = express.Router()
    , mongoose = require('mongoose')
    , multer = require('multer')
    , path = require('path')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , expressValidator = require('express-validator')
    , flash = require('connect-flash')



/*
* Multer Configuration
*/
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname+Date.now()+path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
}).single('imageuploader')
    // Models
const Article = require('../models/article')
    ,  User = require('../models/user')
    ,  userArticle = require('../models/userarticle')
    ,  Bugs = require('../models/bugs')

/*
* Global Var
*/
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin.handlebars' 
  next()
})

const newBugs = function(error, whosLoggedin) {
  const newBugs = new Bugs({
    _id: new mongoose.Types.ObjectId(),
    error: error,
    whosLoggedin: whosLoggedin
  })
  newBugs.save()
}

/* Auth Routing */

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
        return done(null, user)
      }
      else {
        return done(null, false, { message: 'Invalid Password'})
      }
    })
  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user)
  })
})


router.post('/login', passport.authenticate('local', {successRedirect: '/admin', failureRedirect: '/home/login', failureMessage: 'Invalid username or password', failureFlash: true}), (req, res) => {
  req.session.authenticate = true;
  res.redirect('/admin')
  }
)


router.post('/request/post/:id', (req, res) => {
  userArticle.findById({
    _id: req.params.id
  })
  .then(result => {
    const newArticle = new Article({
        _id: new mongoose.Types.ObjectId(),
        title: result.title,
        body: result.body,
        createdBy: result.createdBy,
        dateCreate: result.dateRequested
    })
    newArticle
    .save()
    .then(saved => {
      req.flash('success', 'Article Published')
      res.redirect('/admin')
      userArticle.remove({
        _id: req.params.id
      })
      .catch(err => {
        console.log(err)
      })
    })
  })
  .catch(err => {
    newBugs(err, req.user.firstname + '' + req.user.lastname)
  })
})


router.get('/logout', (req, res) => {
  req.flash('success', 'Succesfully logged you out')
  req.logout()
  res.redirect('/home/login')
})

/* User Routing */
router.get('/', (req, res) => {
  console.log(req.isAuthenticated())
  userArticle.find()
  .select('title body createdBy dateCreate')
  .then(results => {
    const response = {
      count: results.length,
      post: results.map(result => {
        return {
          title: result.title,
          body: result.body,
          createdBy: result.createdBy,
          dateCreate: result.dateCreate,
        }
      })
    }
    if(!req.user) {
      req.flash('notauth', 'Unauthorized Log in first')
      res.redirect('/home/login')
    }
    else{
      res.render('admin/panel', { posts: response.post, firstname: req.user.firstname , success: req.flash('success')})
    }
  })
  .catch(err => newBugs(err, req.user.firstname + '' + req.user.lastname))})

router.get('/create', (req, res) => {
  res.render('admin/create')
})

router.post('/create', upload, (req, res) => {
    const newArticle = new userArticle({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    body: req.body.body,
    createdBy: req.user.firstname + ' ' + req.user.lastname 
  })
  newArticle
  .save()
  .then(results => {
    const response = {
      message: 'Created successfully you need wait adminstrator to approve it thanks',
      postReq: {
            title: results.title,
            body: results.body,
            createdBy: results.createdBy,
            dateCreate: results.dateCreate     
      }
    }
    req.flash('success', response.message)
    res.redirect('/admin')
})
.catch(err => console.log(err))
})

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err) {
      res.send(err)
    }
    res.render('admin/uploads', {layout: 'admin.handlebars' , imgfile: req.file.filename})
  })
})

router.get('/requests', (req, res) => {
  if(req.user.admin === true) {
    userArticle.find()
    .then(results => {
      const response = {
        count: results.length,
        posts: results.map(result => {
          return {
            id: result._id,
            title: result.title.slice(0, 60) + '...',
            body: result.body,
            createdBy: result.createdBy,
            dateCreate: result.dateCreate
          }
        })
      }
      res.render('admin/request', {
        posts: response.posts
      })
    })
    .catch(err => {
      newBugs(err, req.user.firstname + ' ' + req.user.lastname)
    })
  }
  else{
    req.flash('Error', 'Forbidden')
    res.status(403)
    res.redirect('/admin')
  }
})
router.get('/request/post/:id', (req, res) => {
  userArticle.findById({
    _id: req.params.id
  })
  .select('_id dateCreate title body createBy')
  .then(result => {
    res.render('admin/reqpost', { post: result })
  })
  .catch(err => newBugs(err, req.user.firstname + ' ' + req.user.lastname))})

router.get('/edit', (req, res) => {
  Article.find()
  .then(results => {
  res.render('admin/edit', { results: results })
  })
  .catch(err => newBugs(err, req.user.firstname + ' ' + req.user.lastname))})

router.get('/edit/:id', (req, res) => {
  let id = req.params.id
  Post.findById(id)
  .then(result => {
    res.json(result)
  })
  .catch(err => newBugs(err, req.user.firstname + ' ' + req.user.lastname || null))})

router.delete('/edit/delete/:id', (req, res) => {
  let id = req.params.id
  Post.remove({
    _id: id
  })
  .then(() => {
    res.redirect('/admin/edit')
  })
})

/**
*
* Checking if it is authenticate
* 
**/

function isAuth(req, res, next) {
  if (req.isAuthenticated()) 
  { return next();

  }
  res.redirect('/')
}
module.exports = router