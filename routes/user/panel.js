const express = require('express')
    , router = express.Router()
    , RequestArticle = require('../../models/RequestArticle')
    , Article = require('../../models/Article')
    , flash = require('connect-flash')

// Panel Routing
router.get(`/`,(req, res) => {
  // Get the article to display in to panels
  RequestArticle.find({'userId': req.user._id}, null, {sort: {dateRequested: 'desc'}}, (requestArticleError, requestArticle) => {
    Article.find({'userId': req.user._id}, null, {sort: {datePublished: 'desc'}},(articleError, article) => {
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
            dateRequested: dateFormat.fullDate(e.dateRequested),
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
            datePublished: dateFormat.fullDate(e.datePublished),
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

// Log out the user or adminstrator
router.get("/logout", (req, res) => {
  req.flash("success", "Succesfully logged you out");
  req.logout();
  res.redirect("/home/login");
});

module.exports = router