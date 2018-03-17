const express = require("express"),
      router = express.Router(),
      mongoose = require("mongoose"),
      path = require("path"),
      passport = require("passport"),
      LocalStrategy = require("passport-local").Strategy,
      expressValidator = require("express-validator"),
      csrf = require('csurf')
      flash = require("connect-flash");

const csrfProtection = csrf()
  // Models
const Article = require("../models/Article")
     , User = require("../models/User");

  // Get date format mmmm-dd-yyyy
   dateFormat = require("../module/dateFormat");


router.all("/*", (req, res, next) => {
  //Routing Global Variables
  req.app.locals.layout = "main.handlebars";
  next();
});

// Home Route
router.get("/", (req, res) => {
  
  Article.find().sort([['datePublished', 'desc']])
    .limit(6)
    .then(results => {
      // Catch articles within array
      let articles = [];

      results.forEach(result => {
        let imgOpenTag = result.body.search("<img"),
            imgCloseTag = result.body.search("/>"),

            // Get html element <img  src="*"/>
            img = result.body.toString().slice(imgOpenTag, imgCloseTag + 2)

        //This will gonna truncate a title if it is over 100 character so the article title wont overflow in home articles boxes
        function truncateTitle(title) {
          if (title.length > 100) {
            return (title = title.substring(0, 100) + "...");
          }
          return title;
        }
        
       //As we get the img element this will gonna get the source url
       let src = img.split(' ').filter(e =>{
          return e.includes('src')
       })
       let imagePath = src[0].substring(5, src[0].length - 1)

        if (src) {
          articles.push({
            _id: result._id,
            title: truncateTitle(result.title),
            src: imagePath
          });
        } else {
          articles.push({
            _id: result._id,
            title: truncateTitle(result.title),
            src:
              "https://www.drbrownstein.com/wp-content/uploads/2017/03/500x500.png"
          });
        }
      });

      res.status(200).render("home/home", {
        articles: articles,
        layout: "main.handlebars",
        user: req.user,
      });
    })
    .catch(err => {
      error: err;
    });
});

//Selected post route
router.get("/article/:id", (req, res) => {
  Article.findOne({
    _id: req.params.id
  })
    .then(results => {
      res.render("home/post", {
        layout: "main.handlebars",
        post: results
      });
    })
    .catch(err => {
      res.render("home/post", {
        layout: "main.handlebars",
        error: err
      });
    });
});


// Register route
router.get("/register", csrfProtection, (req, res) => {
  res.render("user/register", {
    csrfToken: req.csrfToken()
  })
})

router.post("/register", csrfProtection, (req, res) => {
  let username = req.body.username.toLowerCase(),
    firstname = req.body.firstname.toLowerCase(),
    lastname = req.body.lastname.toLowerCase(),
    email = req.body.email.toLowerCase(),
    password = req.body.password,
    password2 = req.body.password2;

  // Register form Validator
  req.checkBody("username", "Username field cannot be empty").notEmpty();
  req.checkBody("username", "Username is already taken").isUsernameAvailable();
  req
    .checkBody("username", "Username must be at least 4 characters long")
    .len(4);
  req.checkBody("firstname", "Your first name is required").notEmpty();
  req.checkBody("lastname", "Your last name is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Invalid Email").isEmail();
  req
    .checkBody("email", "Email address must be at least 3 characters long")
    .len(3);
  req.checkBody("email", "Email is already exists").isEmailAvailable();
  req.checkBody("password", "Password is required").notEmpty();
  req.checkBody("password", "Password should be at least 8 characters").len(8);
  req.checkBody("password2", "Confirm your password").notEmpty();
  req.checkBody("password2", "Password do not match").equals(password);

  req.asyncValidationErrors()
  .then(result => {
    let newUser = new User({
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password
    });
    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      else {
        req.flash("success", "Succesfully create you can now log in");
        res.location("/");
        res.redirect("/home/login");
      }
    });
  })
  .catch(errors => {
    const usernameError = errors.filter(error => error.from === "username"),
      firstnameError = errors.filter(error => error.from === "firstname"),
      lastnameError = errors.filter(error => error.from === "lastname"),
      emailError = errors.filter(error => error.from === "email"),
      passwordError = errors.filter(error => error.from === "password"),
      password2Error = errors.filter(error => error.from === "password2");
    res.render("user/register", {
      errorforms: {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
      },
      usernameError,
      firstnameError,
      lastnameError,
      emailError,
      passwordError,
      password2Error
    });
  });
});
router.get("/login", csrfProtection, (req, res) => {
  if (!req.user) {
    res.render("home/login", {
      layout: "main.handlebars",
      success: req.flash("success"),
      errors: req.flash("error"),
      csrfToken: req.csrfToken()
    });
  } else {
    res.redirect("/user");
  }
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.getUserbyUsername(username.toLowerCase(), (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, {
          message: "Unknown User"
        });
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/home/login",
    failureFlash: true
  }),
  (req, res) => {
    req.session.authenticate = true;
    res.redirect("/user");
  }
);

module.exports = router;
