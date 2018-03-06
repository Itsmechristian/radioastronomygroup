const chai = require('chai')
    , assert = chai.assert
    , should = chai.should()

 Article = require('../models/Article')
     RequestArticle = require("../models/RequestArticle")
     User = require('../models/User')

describe('Change Article Image Path', () => {
  it('I should get an Article', function() {
    Article.find().then(res => {
     should.exist(res)
    }).catch(err => should.not.exist(err))
  })
  it('I should get a Request Article', () => {
    RequestArticle.find().then(res => {
      var test = changeArticlePath(res);
      expect(test).to.be.a('string');
    })
  })
  it('I should get a User', () => {
    User.find().then(res => {
      should.exist(res)
    }).catch(err => should.now.exist(err))
  })
})