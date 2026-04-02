const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Standard user auth flows
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);

module.exports = router;
