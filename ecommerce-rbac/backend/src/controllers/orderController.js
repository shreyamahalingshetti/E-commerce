const orderModel = require('../models/orderModel');

exports.createOrder = async (req, res, next) => {
  try {
    const { total_amount, items, razorpay_order_id, razorpay_payment_id } = req.body;
    const order = await orderModel.createOrder(req.user.id, total_amount, items, razorpay_order_id, razorpay_payment_id);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.findByUserId(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.findAll();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderModel.updateStatus(req.params.id, status);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};
