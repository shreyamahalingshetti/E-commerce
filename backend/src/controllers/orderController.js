const orderModel = require('../models/orderModel');

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getOrdersByUser(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const sellerId = (req.user.role === 'admin' && req.query.seller_id) ? req.query.seller_id : req.user.id;
    const orders = await orderModel.getOrdersBySeller(sellerId);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await orderModel.getSalesStats();
    res.status(200).json({
      totalSales: stats?.total_sales || 0,
      totalOrders: stats?.total_orders || 0,
      total_sales: stats?.total_sales || 0,
      total_orders: stats?.total_orders || 0
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyOrders,
  getSellerOrders,
  getAllOrdersAdmin,
  getAllOrders: getAllOrdersAdmin,
  getStats,
  getOrderStats: getStats,

  // Backwards compatibility
  createOrder: async (req, res, next) => {
    try {
      const { total_amount, items, razorpay_order_id, razorpay_payment_id } = req.body;
      const order = await orderModel.createOrder(req.user.id, total_amount, items, razorpay_order_id, razorpay_payment_id);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }
};
