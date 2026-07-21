const wishlistModel = require('../models/wishlistModel');

const getWishlist = async (req, res, next) => {
  try {
    const items = await wishlistModel.getWishlistByUser(req.user.id);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const productId = req.body.productId || req.body.product_id;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    const item = await wishlistModel.addWishlistItem(req.user.id, productId);
    res.status(201).json(item || { message: 'Item added to wishlist' });
  } catch (err) {
    next(err);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId || req.params.id || req.body.productId || req.body.product_id;
    const item = await wishlistModel.removeWishlistItem(req.user.id, productId);
    if (!item) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (err) {
    next(err);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const productId = req.body.productId || req.body.product_id;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    const result = await wishlistModel.toggleItem(req.user.id, productId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist
};
