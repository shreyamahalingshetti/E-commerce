const db = require('../config/db');

exports.createOrder = async (userId, totalAmount, items, razorpayOrderId, razorpayPaymentId) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, razorpay_order_id, razorpay_payment_id) 
       VALUES ($1, $2, 'Completed', $3, $4) RETURNING *`,
      [userId, totalAmount, razorpayOrderId, razorpayPaymentId]
    );
    const order = orderRes.rows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');
    return order;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

exports.findByUserId = async (userId) => {
  const res = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
};

exports.findAll = async () => {
  const res = await db.query(
    `SELECT o.*, u.name as user_name, u.email as user_email 
     FROM orders o 
     JOIN users u ON o.user_id = u.id 
     ORDER BY o.created_at DESC`
  );
  return res.rows;
};

exports.updateStatus = async (orderId, status) => {
  const res = await db.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, orderId]
  );
  return res.rows[0];
};
