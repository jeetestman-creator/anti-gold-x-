const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

router.get('/rates', calculatorController.getRates);
router.post('/share-results', calculatorController.shareResults);

module.exports = router;
