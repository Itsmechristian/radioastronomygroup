const express = require('express')
    , router = express.Router()
    , mongoose = require('mongoose')
    , RequestArticle = require('../../models/RequestArticle')
    , Article = require('../../models/Article')
    , articleConfiguration = require('../../module/articleConfiguration')

// This is administrator routes for user request article
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
        res.render("admin/request", {
          posts: response.posts
        });
      })
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
      res.render("admin/reqpost", { post: result });
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
});

// Get the administrator to access and edit user article manually
router.get("/edit", (req, res) => {
  Article.find()
    .then(results => {
      res.render("user/edit", { results: results });
    })
});

router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  Post.findById(id)
    .then(result => {
      res.json(result);
    })
});

module.exports = router;    