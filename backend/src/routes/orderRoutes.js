const express = require('express');
const router = express.Router();
const { getMyOrders, getSellerOrders, getAllOrdersAdmin, getStats } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.use(authMiddleware);

router.get('/mine', getMyOrders);
router.get('/seller', roleGuard('sales_person', 'sales', 'admin'), getSellerOrders);
router.get('/all', roleGuard('admin'), getAllOrdersAdmin);
router.get('/stats', roleGuard('admin'), getStats);

module.exports = router;
