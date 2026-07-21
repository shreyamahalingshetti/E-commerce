const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

module.exports = router;
