const mongoose = require('mongoose')
, Schema = mongoose.Schema

const articleSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,
        required: true
    },
    isPublish: {
        type: Boolean,
        required: true
    },
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
    dateCreate:{
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Article', articleSchema)