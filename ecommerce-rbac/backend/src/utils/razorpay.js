const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_key_secret'
});

module.exports = razorpayInstance;

