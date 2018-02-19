const mongoose = require('mongoose')
, Schema = mongoose.Schema
, getdate = require('../config/getdate')

const errorSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    error: {
        type: String
    },
    dateOccur: {
        type: Date,
        default: getdate.getdate
    }
})

module.exports = mongoose.model('error', errorSchema)