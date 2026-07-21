const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, toggleWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.post('/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;
