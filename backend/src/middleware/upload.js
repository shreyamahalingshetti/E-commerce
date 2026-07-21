const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const uploadMulter = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const handleCloudinaryUpload = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'products' },
    (error, result) => {
      if (error) {
        return next(error);
      }
      req.body.image_url = result.secure_url;
      next();
    }
  );

  uploadStream.end(req.file.buffer);
};

const uploadSingleImage = [uploadMulter.single('image'), handleCloudinaryUpload];

module.exports = {
  uploadMulter,
  handleCloudinaryUpload,
  uploadSingleImage
};

