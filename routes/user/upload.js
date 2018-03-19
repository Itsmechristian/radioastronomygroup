const express = require('express')
    , router = express.Router()
    , multer = require("multer")
    , path = require("path")
    , csrf = require('csurf')

const csrfProtection = csrf()    
// Initialize multer to uplaod a file
const storage = multer.diskStorage({
  destination: "./public/temp",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    files: 1,
    fields: 1,
    fileSize: 2000000
  }
}).single("imageuploader");
// Multer check for file type
function checkFileType(file, cb) {
  // Check the file types
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  // Condional
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only");
  }
}


// Image Upload Routing so they can upload images in Article
router.get('/upload', csrfProtection ,(req, res) => {
  res.render('user/uploads', {layout: '' })
})
router.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("user/uploads", {
        error: err,
        layout: ''
      });
    } else {
      const imageInfo = {
        filename: req.file.filename,
        path: req.file.path.slice(6, req.file.path.length),
        size: parseFloat(req.file.size / 1024).toFixed(2) + 'kb'
      }
      res.render("user/uploads", {
        imageInfo,
        layout: ''
      });
    }
  });
});  

module.exports = router;