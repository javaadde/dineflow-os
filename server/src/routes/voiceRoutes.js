const express = require('express');
const { parseOrderCommand } = require('../controllers/voiceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/order-command', authMiddleware, parseOrderCommand);

module.exports = router;
