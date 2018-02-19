const mongoose = require('mongoose')
, Schema = mongoose.Schema
, getdate = require('../config/getdate')

const tempPostSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true
    },
    dateRequested:{ 
        type: String,
        default: getdate.getdate,
        required: true
    }
})

module.exports = mongoose.model('TempPost', tempPostSchema)