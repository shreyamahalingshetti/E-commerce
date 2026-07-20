const cartModel = require('../models/cartModel');

const getCart = async (req, res, next) => {
  try {
    const items = await cartModel.findByUserId(req.user.id);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' });
    }
    const item = await cartModel.addItem(req.user.id, product_id, quantity ? parseInt(quantity, 10) : 1);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const updateCartQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;
    if (quantity === undefined) {
      return res.status(400).json({ error: 'quantity is required' });
    }
    const item = await cartModel.updateQuantity(id, req.user.id, parseInt(quantity, 10));
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await cartModel.removeItem(id, req.user.id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart
};

