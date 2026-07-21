const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartQuantity, removeFromCart } = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartQuantity);
router.delete('/:id', removeFromCart);

module.exports = router;
