<<<<<<< HEAD
const mongoose = require('mongoose')
, Schema = mongoose.Schema

const postSchema = new Schema ({
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
    dateCreate:{
        type: String,
        required: true
    }
})

=======
const mongoose = require('mongoose')
, Schema = mongoose.Schema

const postSchema = new Schema ({
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
    dateCreated:{
        type: String,
        required: true
    }
})

>>>>>>> 8f83c5f5f46b58c18d1463749d84121efec767b3
module.exports = mongoose.model('post', postSchema)