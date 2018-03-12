
const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  multer = require("multer"),
  path = require("path"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  expressValidator = require("express-validator"),
  flash = require("connect-flash"),
  fs = require("fs"),
  url = require("url");

const getdate = require('../module/getdate')

// Initialize multer to uplaod a file
const storage = multer.diskStorage({
  destination: "./public/temp",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("imageuploader");

// Multer check for file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only");
  }
}

// Models
  Article = require("../models/Article"),
  User = require("../models/User"),
  RequestArticle = require("../models/RequestArticle"),
  Bugs = require("../models/Bugs");

// Own Module
  const articleConfiguration = require('../module/articleConfiguration')

 router.use((req, res, next) => {
  if(req.session && req.user) {
      req.app.locals.layout = "main.handlebars";
      req.session.user = req.user;
    next()
  }
  else{
    req.flash('error', 'Logged In First');
    res.redirect('/home/login')
  }
 })
 function isLogin(req, res, next) {
 
 } 

// Tracking what are the errors
const newBugs = function(error, whosLoggedin) {
  const newBugs = new Bugs({
    _id: new mongoose.Types.ObjectId(),
    error: error,
    whosLoggedin: whosLoggedin
  });
  newBugs.save();
};

router.get("/" ,(req, res) => {
    RequestArticle.find({'userId': req.user._id}, null, {sort: {dateRequested: 1}}, (requestArticleError, requestArticle) => {
      Article.find({'userId': req.user._id}, null, {sort: {dateRequested: 1}},(articleError, article) => {
        if(requestArticleError || articleError) {
          req.logout()
          res.redirect('/home/login')
          req.flash('error', 'There\'s a problem try again later')
        }
        let userArticles = 
        { 
          notpublish: {
          requestCount: requestArticle.length,
          results: requestArticle.map(e => {
            return {
              _id: e._id,
              title: e.title,
              dateRequested: getdate(e.dateRequested),
              author: e.requestBy, 
              status: {
                isPublish: e.isPublish
              },
            }
          })
        },
        published: {
          requestCount: article.length,
          results: article.map(e => {
            return {
              _id: e._id,
              title: e.title,
              datePublished: getdate(e.datePublished),
              author: e.requestBy, 
              status: {
                isPublish: e.isPublish
              },
            }
          })
        }
      }
  
      res.render("user/panel", {
        notpublishcount: userArticles.notpublish.requestCount,
        notpublishresult: userArticles.notpublish.results[0],
        publishedcount: userArticles.published.requestCount,
        published: userArticles.published.results[0]
          })
        })  
      })
});

router.get('/article/:id', (req, res) => {
  RequestArticle
  .findById(req.params.id)
  .then(docs => {
    res.render('user/post', {docs})
  })
  .catch(err => {
    console.log(err)
  })
})
router.get("/create",(req, res) => {
  res.render("user/create");
});

router.post("/create", upload, (req, res) => {

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
       requestBy: req.user.firstname + req.user.lastname
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

router.get('/upload', (req, res) => {
  res.render('user/uploads', {layout: '' })
})
router.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("user/uploads", {
        error: err
      });
    } else {
      const imageInfo = {
        filename: req.file.filename,
        path: req.file.path.slice(6, req.file.path.length),
        size: parseFloat(req.file.size / 1024).toFixed(2) + 'kb'
      }
      res.render("user/uploads", {
        imageInfo,
        layout: ''
      });
    }
  });
});

router.get("/requests", (req, res) => {
  if (req.user.admin === true) {
    
    RequestArticle
      .find()
      .then(results => {
        const response = {
          count: results.length,
          posts: results.map(result => {
            return {
              id: result._id,
              title: result.title.slice(0, 60) + "...",
              body: result.body,
              createdBy: result.createdBy,
              dateCreate: result.dateCreate
            };
          })
        };
        res.render("user/request", {
          posts: response.posts
        });
      })
      .catch(err => {
        newBugs(err, req.user.firstname + " " + req.user.lastname);
      });
  } else {
    req.flash("Error", "Forbidden");
    res.status(403);
    res.redirect("/user");
  }
});
router.get("/request/post/:id", (req, res) => {
  RequestArticle
    .findById({
      _id: req.params.id
    })
    .select("_id dateRequested title body createBy")
    .then(result => {
      res.render("user/reqpost", { post: result });
    })
    .catch(err => console.log(err));
});

router.post("/request/post/:id", (req, res) => {
  RequestArticle
    .findById({
      _id: req.params.id
    })
    .then(result => {

      const newArticle = new Article({
        _id: new mongoose.Types.ObjectId(),
        userId: result.userId,
        isPublish: true,
        title: result.title,
        body: articleConfiguration(result),
        createdBy: result.requestBy,
      });
      newArticle.save().then(saved => {
        req.flash("success", "Article Published");
        res.redirect("/user");
        RequestArticle
          .remove({
            _id: req.params.id
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
    .catch(err => {
      console.log(err)
    });
});

router.get("/edit", (req, res) => {
  Article.find()
    .then(results => {
      res.render("user/edit", { results: results });
    })
    .catch(err => newBugs(err, req.user.firstname + " " + req.user.lastname));
});

router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  Post.findById(id)
    .then(result => {
      res.json(result);
    })
    .catch(err =>
      newBugs(err, req.user.firstname + " " + req.user.lastname || null)
    );
});

router.delete("/edit/delete/:id", (req, res) => {
  let id = req.params.id;
  Post.remove({
    _id: id
  }).then(() => {
    res.redirect("/user/edit");
  });
});

router.get("/logout", (req, res) => {
  req.flash("success", "Succesfully logged you out");
  req.logout();
  res.redirect("/home/login");
});

module.exports = router;