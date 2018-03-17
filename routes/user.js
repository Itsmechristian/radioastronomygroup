
const express = require("express"),
      router = express.Router(),
      flash = require("connect-flash"),
      mongoose = require('mongoose')
      dateFormat = require('../module/dateFormat')


// Models
  Article = require("../models/Article"),
  User = require("../models/User"),
  RequestArticle = require("../models/RequestArticle"),
  Events = require('../models/Events')
  Bugs = require("../models/Bugs");

// Own Module


// Tracking what are the errors
const newBugs = function(error, whosLoggedin) {
  const newBugs = new Bugs({
    _id: new mongoose.Types.ObjectId(),
    error: error,
    whosLoggedin: whosLoggedin
  });
  newBugs.save();
};





module.exports = router;