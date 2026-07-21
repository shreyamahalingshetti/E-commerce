const wishlistModel = require('../models/wishlistModel');

const getWishlist = async (req, res, next) => {
  try {
    const items = await wishlistModel.findByUserId(req.user.id);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' });
    }
    const item = await wishlistModel.addItem(req.user.id, product_id);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await wishlistModel.removeItem(id, req.user.id);
    if (!item) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};

