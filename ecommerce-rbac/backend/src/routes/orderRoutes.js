const express = require('express');
const router = express.Router();
const { getMyOrders, getSellerOrders, getAllOrders, getOrderStats } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.use(authMiddleware);

router.get('/mine', getMyOrders);
router.get('/seller', roleGuard('sales_person', 'sales'), getSellerOrders);
router.get('/all', roleGuard('admin'), getAllOrders);
router.get('/stats', roleGuard('admin'), getOrderStats);

module.exports = router;

