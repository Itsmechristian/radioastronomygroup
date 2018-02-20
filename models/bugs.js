const mongoose = require('mongoose')
, Schema = mongoose.Schema
, getdate = require('../config/getdate')

const bugsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    error: {
        type: String
    },
    dateOccur: {
        type: Date,
        default: getdate.getdate
    },
    whosLoggedin: {
        type: String
    }
})

module.exports = mongoose.model('bugs', bugsSchema)