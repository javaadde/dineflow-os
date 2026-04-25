const express = require('express');
const { uploadImage, listMyImages } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', authMiddleware, listMyImages);
router.post('/upload', authMiddleware, upload.single('image'), uploadImage);

module.exports = router;
