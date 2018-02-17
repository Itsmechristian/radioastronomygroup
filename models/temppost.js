const mongoose = require('mongoose')
, Schema = mongoose.Schema
, moment = require('moment')

Date.prototype.getFormatDate = function() {
    const monthNames = ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return this.getDate()+' '+monthNames[this.getMonth()]+', '+this.getFullYear()
}

var getFormat = new Date().getFormatDate()

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
    dateCreate:{ 
        type: String,
        default: getFormat,
        required: true
    }
})

module.exports = mongoose.model('TempPost', tempPostSchema)