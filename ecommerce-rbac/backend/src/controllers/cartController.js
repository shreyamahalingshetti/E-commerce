const cartModel = require('../models/cartModel');

exports.getCart = async (req, res, next) => {
  try {
    const cartItems = await cartModel.findByUserId(req.user.id);
    res.status(200).json(cartItems);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const item = await cartModel.addItem(req.user.id, product_id, quantity || 1);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

exports.updateCartQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await cartModel.updateQuantity(req.params.id, req.user.id, quantity);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    await cartModel.removeItem(req.params.id, req.user.id);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};
