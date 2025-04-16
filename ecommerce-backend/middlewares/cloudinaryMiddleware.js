const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { tags: 'user_uploads' }, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

module.exports = uploadToCloudinary;
