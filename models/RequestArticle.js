const mongoose = require('mongoose')
, Schema = mongoose.Schema

const RequestArticleSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,
        required: true
    },
    isPublish: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    requestBy: {
        type: String,
    },
    dateRequested:{ 
        type: Date,
        default: new Date(),
        required: true
    }
})

module.exports = mongoose.model('RequestArticle', RequestArticleSchema)