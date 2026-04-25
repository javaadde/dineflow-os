const express = require('express');
const multer = require('multer');
const { parseOrderCommand, transcribeOrderCommand } = require('../controllers/voiceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post('/order-command', authMiddleware, parseOrderCommand);
router.post('/transcribe-order', authMiddleware, upload.single('audio'), transcribeOrderCommand);

module.exports = router;
