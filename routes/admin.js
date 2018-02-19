<<<<<<< HEAD
const express = require('express')
    , router = express.Router()
    , mongoose = require('mongoose')
    , multer = require('multer')
    , path = require('path')
    , fs = require('fs')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , expressValidator = require('express-validator')
    , flash = require('connect-flash')
    , exphbs = require('express-handlebars')


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
    Post = require('../models/post')
    User = require('../models/user')
    TempPost = require('../models/temppost')

/*
* Global Var
*/
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin.handlebars' 
  req.app.locals.user = req.user
  next()
})

router.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.errors = req.flash('errors')
  res.locals.notAuth = req.flash('notauth')
  next()
})
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err) {
      res.send(err)
    }
    console.log(req.file.filename)
    res.render('admin/uploads', {layout: 'admin.handlebars' , imgfile: req.file.filename})
  })
})
// router.get('/upload?Type=Images&CKEditor=editor&CKEditorFuncNum=1&langCode=en-gb' ,(req, res) =>
// res.send('success')
// )

/* Auth Routing */
router.get('/register', isAuth, (req, res) => {
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
    req.checkBody('username', 'Username field is cannot be empty').notEmpty()
    req.checkBody('username', 'Username is already taken').isUsernameAvailable()
    req.checkBody('username', 'Username must be between 4-15 characters long').len(4, 15)
    req.checkBody('firstname', 'Your first name is required').notEmpty()
    req.checkBody('lastname', 'Your last name is required').notEmpty()
    req.checkBody('email', 'Email field is required').notEmpty()
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again').len(4, 100)
    req.checkBody('email', 'Email is already exists').isEmailAvailable()
    req.checkBody('password', 'Password is required').notEmpty()
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
              req.flash('success', 'Succesfully create')
              res.location('/')
              res.redirect('/admin')
            }
          })
    })
    .catch(error => {
            res.render('admin/register', {
          form: {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
          },
          errors: error
        })
    })
})


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
  req.flash('success', 'You are now logged in')
  req.session.authenticate = true;
  res.redirect('/admin')
}
)


router.post('/request/post/:id', (req, res) => {
  TempPost.findById({
    _id: req.params.id
  })
  .then(result => {
    const newPost = new Post({
        _id: new mongoose.Types.ObjectId(),
        title: result.title,
        body: result.body,
        createdBy: result.createdBy,
        dateCreate: result.dateCreate
    })
    newPost
    .save()
    .then(saved => {
      req.flash('success', 'Post Published')
      res.redirect('/admin')
      console.log('Success')
      TempPost.remove({
        _id: req.params.id
      }).catch(err => console.log(err))
    })
  })
  .then(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'asdsadasdsa')
  console.log(req.flash('success', ' test'))
  res.redirect('/home/login')
})

/* User Routing */
router.get('/', (req, res) => {
  TempPost.find()
  .select('title body createdBy dateCreate')
  .then(results => {
    const response = {
      count: results.length,
      post: results.map(result => {
        return {
          title: result.title,
          body: result.body,
          createdBy: result.createdBy,
          dateCreate: result.dateCreate
        }
      })
    }
    if(!req.user) {
      req.flash('notauth', 'Unauthorized Log in first')
      res.redirect('/home/login')
    }
    else{
      res.render('admin/panel', { posts: response.post, firstname: req.user.firstname })
    }
  }).catch(err => console.log(err))
})

router.get('/create', (req, res) => {
  res.render('admin/create')
})

router.post('/create', upload,(req, res) => {
    const newPost = new TempPost({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    body: req.body.body,
    createdBy: 'John Doe'
  })
  newPost.save()
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
.catch(err => {
  console.log(err)
})
})

router.get('/requests', (req, res) => {
  if(req.user.admin === true) {
    TempPost.find()
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
  }
  else{
    req.flash('Error', 'Forbidden')
    res.status(403)
    res.redirect('/admin')
  }
})
router.get('/request/post/:id', (req, res) => {
  TempPost.findById({
    _id: req.params.id
  })
  .select('_id dateCreate title body createBy')
  .then(result => {
    res.render('admin/reqpost', { post: result })
  })
})

router.get('/edit', (req, res) => {
  Post.find()
  .then(results => {
  res.render('admin/edit', { results: results })
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/edit/:id', (req, res) => {
  let id = req.params.id
  Post.findById(id)
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    console.erorr(err)
  })
})

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
=======
const express = require('express')
    , router = express.Router()
    , mongoose = require('mongoose')
    , multer = require('multer')
    , path = require('path')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , expressValidator = require('express-validator')
    , flash = require('connect-flash')
    , exphbs = require('express-handlebars')


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
}).any()
    // Models
    Post = require('../models/post')
    User = require('../models/user')
    TempPost = require('../models/temppost')
    Bugs = require('../models/error')
/*
* Global Var
*/ 
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin.handlebars' 
  req.app.locals.user = req.session.user
  next()
})

router.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.errors = req.flash('errors')
  res.locals.notAuth = req.flash('notauth')
  res.locals.user = req.user
  next()
})

/* Auth Routing */
// router.get('/register', /* isAuth = Uncomment after editing */, (req, res) => {
//   res.render('admin/register')
// })

router.post('/register', (req, res) => {
  let username = req.body.username.toLowerCase()
    , firstname = req.body.firstname.toLowerCase()
    , lastname = req.body.lastname.toLowerCase()
    , email = req.body.email.toLowerCase()
    , password = req.body.password
    , password2 = req.body.password2
  
    // Form Validator
    req.checkBody('username', 'Username field is cannot be empty').notEmpty()
    req.checkBody('username', 'Username is already taken').isUsernameAvailable()
    req.checkBody('username', 'Username must be between 4-15 characters long').len(4, 15)
    req.checkBody('firstname', 'Your first name is required').notEmpty()
    req.checkBody('lastname', 'Your last name is required').notEmpty()
    req.checkBody('email', 'Email field is required').notEmpty()
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again').len(4, 100)
    req.checkBody('email', 'Email is already exists').isEmailAvailable()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password', 'Password should be atleast 8 characters').len(8, 100)
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
              req.flash('success', 'Succesfully create')
              res.location('/')
              res.redirect('/admin')
            }
          })
    })
    .catch(error => {
            res.render('admin/register', {
          form: {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
          },
          errors: error
        })
    })
})

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user)
  })
})

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

router.post('/request/post/:id', (req, res) => {
  TempPost.findById({
    _id: req.params.id
  })
  .then(result => {
    const newPost = new Post({
        _id: new mongoose.Types.ObjectId(),
        title: result.title,
        body: result.body,
        createdBy: result.createdBy,
        dateCreate: result.dateCreate
    })
    newPost
    .save()
    .then(saved => {
      req.flash('success', 'Post Published')
      res.redirect('/admin')
      console.log('Success')
      TempPost.remove({
        _id: req.params.id
      }).catch(err => console.log(err))
    })
  })
  .then(err => console.log(err))
})

router.post('/login', passport.authenticate('local', {successRedirect: '/admin', failureRedirect: '/home/login', failureMessage: 'Invalid username or password', failureFlash: true}), (req, res) => {
    req.flash('success', 'You are now logged in')
    req.session.authenticate = true;
    res.redirect('/admin')
  }
)

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'asdsadasdsa')
  console.log(req.flash('success', ' test'))
  res.redirect('/home/login')
})

/* User Routing */
router.get('/', (req, res) => {
  TempPost.find()
  .select('title body createdBy dateCreate')
  .then(results => {
    const response = {
      count: results.length,
      post: results.map(result => {
        return {
          title: result.title,
          body: result.body,
          createdBy: result.createdBy,
          dateCreate: result.dateCreate
        }
      })
    }
    if(!req.user) {
      req.flash('notauth', 'Unauthorized Log in first')
      res.redirect('/home/login')
    }
    else{
      res.render('admin/panel', { posts: response.post, firstname: req.user.firstname })
    }
  })
  .catch(err => console.log(err))
})

router.get('/create', (req, res) => {
  res.render('admin/create')
})

router.post('/create', upload,(req, res) => {
    const newPost = new TempPost({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    body: req.body.body,
    createdBy: 'John Doe'
  })
  newPost.save()
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
.catch(err => {
  console.log(err)
})
})

router.get('/requests', (req, res) => {
  if(req.user.admin === true) {
    TempPost.find()
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
  }
  else{
    req.flash('Error', 'Forbidden')
    res.status(403)
    res.redirect('/admin')
  }
})
router.get('/request/post/:id', (req, res) => {
  TempPost.findById({
    _id: req.params.id
  })
  .select('_id dateCreate title body createBy')
  .then(result => {
    res.render('admin/reqpost', { post: result })
  })
})

router.get('/edit', (req, res) => {
  Post.find()
  .then(results => {
  res.render('admin/edit', { results: results })
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/edit/:id', (req, res) => {
  let id = req.params.id
  Post.findById(id)
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    console.erorr(err)
  })
})

router.delete('/edit/delete/:id', (req, res) => {
  let id = req.params.id
  Post.remove({
    _id: id
  })
  .then(() => {
    req.flash('success', 'Succesfully deleted')
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
>>>>>>> 8f83c5f5f46b58c18d1463749d84121efec767b3
module.exports = router