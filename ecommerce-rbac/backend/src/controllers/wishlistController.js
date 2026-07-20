const wishlistModel = require('../models/wishlistModel');

exports.getWishlist = async (req, res, next) => {
  try {
    const items = await wishlistModel.findByUserId(req.user.id);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const result = await wishlistModel.toggle(req.user.id, product_id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
