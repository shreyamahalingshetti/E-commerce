const db = require('../config/db');

exports.findByUserId = async (userId) => {
  const res = await db.query(
    `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = $1`,
    [userId]
  );
  return res.rows;
};

exports.addItem = async (userId, productId, quantity) => {
  const res = await db.query(
    `INSERT INTO cart (user_id, product_id, quantity) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET quantity = cart.quantity + $3 
     RETURNING *`,
    [userId, productId, quantity]
  );
  return res.rows[0];
};

exports.updateQuantity = async (cartId, userId, quantity) => {
  const res = await db.query(
    'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [quantity, cartId, userId]
  );
  return res.rows[0];
};

exports.removeItem = async (cartId, userId) => {
  await db.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [cartId, userId]);
  return true;
};
