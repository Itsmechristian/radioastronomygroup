const chai = require('chai')
    , assert = chai.assert
    , should = chai.should()

 const Article = require('../models/Article'),
     RequestArticle = require("../models/RequestArticle"),
     User = require('../models/User')

describe('Articles test', () => {
  it('I should get a article within the user', () => {
    RequestArticle.findOne({'userId': '5a9de0a615f87a05153f499f'}).then(res => {

      })
    .catch(err => should.exist(err))
  })
})