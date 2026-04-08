const multer = require('multer');
const path = require('path');

// store uploaded files in /audios folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../audios')); // folder path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// export the configured multer
const upload = multer({ storage });

module.exports = upload;
