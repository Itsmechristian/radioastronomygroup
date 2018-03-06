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

// Own Configuration
const changeArticlePath = require("../config/changeArticlePath"),
  changeImgPath = require("../config/changeImgPath");


router.all("/*",(req, res, next) => {
    req.app.locals.layout = "main.handlebars";
    next();
});
const newBugs = function(error, whosLoggedin) {
  const newBugs = new Bugs({
    _id: new mongoose.Types.ObjectId(),
    error: error,
    whosLoggedin: whosLoggedin
  });
  newBugs.save();
};



router.get("/logout", (req, res) => {
  req.flash("success", "Succesfully logged you out");
  req.logout();
  res.redirect("/home/login");
});

router.get("/",(req, res) => {
  if(!req.user) {
    req.flash('error', 'Logged In First');
    res.redirect('/home/login')
  }
  else{
    res.render("user/panel", {
    firstname: req.user.firstname,
    success: req.flash("success")})
  }
});

router.get("/create", (req, res) => {
  res.render("user/create");
});

router.post("/create", upload, (req, res) => {
  const newArticle = new RequestArticle({
    _id: new mongoose.Types.ObjectId(),
    userId: req.user._id,
    title: req.body.title,
    body: req.body.body,
    requestBy: req.user.firstname + " " + req.user.lastname
  });
  newArticle
    .save()
    .then(results => {
      const response = {
        message:
          "Created successfully you need wait adminstrator to approve it thanks",
      };
      req.flash("success", response.message);
      res.redirect("/user");
    })
    .catch(err => console.log(err));
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
    .select("_id dateCreate title body createBy")
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
      changeImgPath(result.body);
      const newArticle = new Article({
        _id: new mongoose.Types.ObjectId(),
        userId: result.userId,
        isPublish: true,
        title: result.title,
        body: changeArticlePath(result),
        createdBy: result.requestBy,
        dateCreate: result.dateRequested
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
      newBugs(err, req.user.firstname + "" + req.user.lastname);
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


module.exports = router;
