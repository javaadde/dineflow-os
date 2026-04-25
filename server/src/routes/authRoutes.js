const express = require('express');
const {
  inviteWorker,
  login,
  loginCompany,
  loginWorker,
  register,
  registerCompany,
  registerWorker,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/company/register', registerCompany);
router.post('/company/login', loginCompany);
router.post('/workers/invite', authMiddleware, inviteWorker);
router.post('/workers/register', registerWorker);
router.post('/workers/login', loginWorker);

module.exports = router;
