const mongoose = require('mongoose')
    , Schema = mongoose.Schema
const EventSchema = new Schema({
  place: {
    type: String,
    required: true
  },
  isodate: {
    type: Date,
    require: true,
  },
  year: String,
  subdate: {
    day: String,
    month: String,
    date: String,
  },
  description:{
    type:String,
    require: true
  },
  isSoldOut: {
    type:Boolean,
    default: false
  }
})



module.exports = mongoose.model('events', EventSchema)