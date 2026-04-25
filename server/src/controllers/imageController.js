const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'dineflow-images',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const savedImage = await Image.create({
      user: req.user._id,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      originalName: req.file.originalname,
    });

    return res.status(201).json(savedImage);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to upload image' });
  }
}

async function listMyImages(req, res) {
  try {
    const images = await Image.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch images' });
  }
}

module.exports = {
  uploadImage,
  listMyImages,
};
