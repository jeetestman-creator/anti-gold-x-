const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');

router.use(protect); // Require auth
router.use(adminOnly); // Require admin role

router.get('/users', adminController.getAllUsers);
router.get('/settings', adminController.getSettings);
router.put('/settings/smtp', adminController.updateSMTPSettings);

// Transaction Approval/Rejection System
router.post('/transactions/:transactionId/approve', adminController.approveTransaction);
router.post('/transactions/:transactionId/reject', adminController.rejectTransaction);

// Super Admin Only
router.delete('/users/:id', superAdminOnly, adminController.deleteUser);

module.exports = router;
