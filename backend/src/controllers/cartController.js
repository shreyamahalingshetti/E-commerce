const cartModel = require('../models/cartModel');

const getCart = async (req, res, next) => {
  try {
    const items = await cartModel.getCartByUser(req.user.id);
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const productId = req.body.productId || req.body.product_id;
    const quantity = req.body.quantity || 1;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const item = await cartModel.upsertCartItem(req.user.id, productId, quantity);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const productId = req.params.productId || req.body.productId || req.body.product_id;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: 'quantity is required' });
    }

    const item = await cartModel.setCartItemQuantity(req.user.id, productId, quantity);
    if (!item && quantity > 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.status(200).json(item || { message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const productId = req.params.productId || req.body.productId || req.body.product_id;
    const item = await cartModel.removeCartItem(req.user.id, productId);
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
  updateQuantity,
  updateCartQuantity: updateQuantity,
  removeFromCart
};
