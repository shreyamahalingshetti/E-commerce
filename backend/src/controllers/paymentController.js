const razorpayInstance = require('../utils/razorpay');
const crypto = require('crypto');
const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel');

const createRazorpayOrder = async (req, res, next) => {
  try {
    let { amount } = req.body;

    if (!amount) {
      // Calculate amount from user's cart if not explicitly provided
      const cartItems = await cartModel.findByUserId(req.user.id);
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
      amount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    }

    const options = {
      amount: Math.round(parseFloat(amount) * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${req.user.id}`
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.status(200).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key_id',
      order: razorpayOrder
    });
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_key_secret';
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Payment signature is valid, process order insertion
    const cartItems = await cartModel.findByUserId(req.user.id);
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Cannot complete order.' });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    // Format items for order snapshot
    const formattedItems = cartItems.map((item) => ({
      product_id: item.product_id,
      seller_id: item.owner_id || item.seller_id || null,
      product_name: item.name || item.product_name || 'Product',
      quantity: item.quantity,
      price: item.price
    }));

    const createdOrder = await orderModel.createOrder(
      req.user.id,
      totalAmount,
      formattedItems,
      razorpay_order_id,
      razorpay_payment_id
    );

    res.status(200).json(createdOrder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment
};

