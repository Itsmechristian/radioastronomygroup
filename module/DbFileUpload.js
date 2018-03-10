require('dotenv').config()

const mongoose = require('mongoose')
    , path = require('path')
    , gridFsStream = require('gridfs-stream')
    , GridFsStorage = require('multer-gridfs-storage')
    , crypto = require('crypto')
    , multer = require('multer')

// Grid fs storage engine
const storageTest = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if(err) return reject (err);

        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'uploads'
        }
        resolve(fileInfo)
      })
    })
  }
})

// Multer configuration
const upload = multer({
  storage: storageTest,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("imageuploader");

// Multer check for file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only");
  }
}

module.exports = {
  upload,
}