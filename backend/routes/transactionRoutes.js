const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect); // requires auth

router.post('/deposit', transactionController.createDeposit);
router.post('/withdraw', transactionController.createWithdrawal);
router.get('/history', transactionController.getTransactionHistory);

// Admin / Cron Specific
router.post('/trigger-roi', adminOnly, transactionController.calculateDailyROI);
router.post('/trigger-monthly-rewards', adminOnly, transactionController.processMonthlyRewards);

module.exports = router;
