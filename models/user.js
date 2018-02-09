const mongoose = require('mongoose')
, Schema = mongoose.Schema
, bcrypt = require('bcryptjs')
const userSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      },
})

module.exports = mongoose.model('user', userSchema)

module.exports.getUserById = (id, cb) => {
  User.findById(id, cb)
}

module.exports.getUserbyUsername = (username, cb) => {
  var query = {username: username}
  User.findOne(query, cb)
}

module.exports.comparePassword = (candidatePassword, hash, cb) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    cb(null, isMatch)
  })
}

/* Encrypt Password */
module.exports.createUser = (newUser, cb) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("B4c0/\/", salt, (err, hash) => {
      newUser.password = hash
      newUser.save(cb)
    }) 
  })
}