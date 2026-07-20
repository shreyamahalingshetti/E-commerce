const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

// Admin & Sales management
router.get('/', roleGuard('admin', 'sales'), getAllOrders);
router.put('/:id/status', roleGuard('admin', 'sales'), updateOrderStatus);

module.exports = router;
