const orderModel = require('../models/orderModel');

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getUserOrders(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getSellerOrders(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderStats = async (req, res, next) => {
  try {
    const stats = await orderModel.getOrderStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyOrders,
  getSellerOrders,
  getAllOrders,
  getOrderStats,

  // Backward compatibility handlers
  createOrder: async (req, res, next) => {
    try {
      const { total_amount, items, razorpay_order_id, razorpay_payment_id } = req.body;
      const order = await orderModel.createOrder(req.user.id, total_amount, items, razorpay_order_id, razorpay_payment_id);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  },
  getUserOrders: getMyOrders
};

