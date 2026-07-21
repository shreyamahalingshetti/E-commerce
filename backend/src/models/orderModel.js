const db = require('../config/db');

const createOrder = async (userId, totalAmount, items, razorpayOrderId, razorpayPaymentId) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, razorpay_order_id, razorpay_payment_id) 
       VALUES ($1, $2, 'paid', $3, $4) RETURNING *`,
      [userId, totalAmount, razorpayOrderId, razorpayPaymentId]
    );
    const order = orderRes.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, seller_id, product_name, price, quantity) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.product_id,
          item.seller_id || item.owner_id,
          item.product_name || item.name || 'Product',
          item.price,
          item.quantity
        ]
      );
    }

    // Clear cart_items / cart table
    try {
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    } catch (e) {
      if (e.code === '42P01') {
        try {
          await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);
        } catch (err) {
          // Table cart does not exist either
        }
      }
    }

    await client.query('COMMIT');
    return order;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const getUserOrders = async (userId) => {
  const query = `
    SELECT o.id, o.user_id, o.total_amount, o.status, o.razorpay_order_id, o.razorpay_payment_id, o.created_at,
    COALESCE(
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'seller_id', oi.seller_id,
          'product_name', oi.product_name,
          'price', oi.price,
          'quantity', oi.quantity
        )
      ) FILTER (WHERE oi.id IS NOT NULL), '[]'
    ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC;
  `;
  const res = await db.query(query, [userId]);
  return res.rows;
};

const getSellerOrders = async (sellerId) => {
  const query = `
    SELECT o.id, o.user_id, u.name as customer_name, u.email as customer_email, o.total_amount, o.status, o.created_at,
    COALESCE(
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'seller_id', oi.seller_id,
          'product_name', oi.product_name,
          'price', oi.price,
          'quantity', oi.quantity
        )
      ) FILTER (WHERE oi.seller_id = $1), '[]'
    ) AS items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN users u ON o.user_id = u.id
    WHERE oi.seller_id = $1
    GROUP BY o.id, u.id
    ORDER BY o.created_at DESC;
  `;
  const res = await db.query(query, [sellerId]);
  return res.rows;
};

const getAllOrders = async () => {
  const query = `
    SELECT o.id, o.user_id, u.name as customer_name, u.email as customer_email, o.total_amount, o.status, o.razorpay_order_id, o.razorpay_payment_id, o.created_at,
    COALESCE(
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'seller_id', oi.seller_id,
          'product_name', oi.product_name,
          'price', oi.price,
          'quantity', oi.quantity
        )
      ) FILTER (WHERE oi.id IS NOT NULL), '[]'
    ) AS items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id, u.id
    ORDER BY o.created_at DESC;
  `;
  const res = await db.query(query);
  return res.rows;
};

const getOrderStats = async () => {
  const query = `
    SELECT 
      COALESCE(SUM(CASE WHEN LOWER(status::text) = 'paid' THEN total_amount ELSE 0 END), 0) AS total_sales,
      COUNT(*)::int AS total_orders
    FROM orders;
  `;
  const res = await db.query(query);
  return res.rows[0];
};

module.exports = {
  createOrder,
  getUserOrders,
  getSellerOrders,
  getAllOrders,
  getOrderStats,

  // Backward compatibility exports
  findByUserId: getUserOrders,
  findAll: getAllOrders
};

