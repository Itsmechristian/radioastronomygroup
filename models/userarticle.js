const mongoose = require('mongoose')
, Schema = mongoose.Schema
, getdate = require('../config/getdate')

const userArticleSchema = new Schema ({
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
    },
    dateRequested:{ 
        type: String,
        default: getdate.getdate,
        required: true
    }
})

module.exports = mongoose.model('userarticle', userArticleSchema)