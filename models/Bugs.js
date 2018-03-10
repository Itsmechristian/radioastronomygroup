const mongoose = require('mongoose')
, Schema = mongoose.Schema

const bugsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    error: {
        type: String
    },
    dateOccur: {
        type: Date,
        default: new Date()
    },
    whosLoggedin: {
        type: String
    }
})

module.exports = mongoose.model('Bugs', bugsSchema)