const mongoose = require('mongoose')
, Schema = mongoose.Schema
, bcrypt = require('bcryptjs')

/**
 * Generates Mongoose uniqueness validator
 * 
 * @param string modelName
 * @param string field
 * @param boolean caseSensitive
 * 
 * @return function
 **/

function unique(modelName, field, caseSensitive) {
  return function(value, respond) {
    if(value && value.length) {
      var query = mongoose.model(modelName).where(field, new RegExp('^'+value+'$', caseSensitive ? 'i' : undefined));
      if(!this.isNew)
        query = query.where('_id').ne(this._id);
      query.count(function(err, n) {
        respond(n<1);
      });
    }
    else
      respond(false);
  };
}

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        caseSensitive: false
    },
      firstname: {
        type: String,
        required: true,
        lowercase: true
    },
    lastname: {
      type: String,
      required: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      caseSensitive: false
    },
    password: {
      type: String,
      required: true,
      },
    admin: {
      type: Boolean,
      default: false
    }
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
    if(err) throw err;
    cb(null, isMatch)
  })
}

/* Encrypt Password */
module.exports.createUser = (newUser, cb) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash
      newUser.save(cb)
    }) 
  })
}