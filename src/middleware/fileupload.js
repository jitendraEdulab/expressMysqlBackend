const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let directory = 'src/public/uploads'
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = (fieldName) =>{
    return multer({ 
      storage: storage,
      fileFilter: (req, file, cb) => {
        if(!['image/png',
        'image/jpeg',
        'image/jpg'].includes(file.mimetype)){
          return cb(new Error('file is not allowed'));
        }
        cb(null, true);
      } }).single(fieldName);
  }

  const profileUpload = (req,res,next) => {
    const uploader = upload('profile');
    uploader(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ status: 400,message: err.message });
      } else if (err) {
        if (err.message === 'file is not allowed') {
          return res.status(400).json({ status: 400,message: 'Invalid file type only png, jpg and jpeg file are allowed.' });
        }
        return res.status(400).json({ status: 400,message: err.message });
      }
      return next();
    });
  }

  module.exports = profileUpload;
