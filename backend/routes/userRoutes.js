const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All user routes require authentication

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/dashboard', userController.getDashboardData);
router.post('/compounding-toggle', userController.toggleCompounding);
router.get('/downline-analytics', userController.getReferralAnalytics);

module.exports = router;
