const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateQuantity, removeFromCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateQuantity);
router.delete('/:productId', removeFromCart);

module.exports = router;
