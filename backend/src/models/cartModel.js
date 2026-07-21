const db = require('../config/db');

const findByUserId = async (userId) => {
  const res = await db.query(
    `SELECT c.id, c.quantity, p.id as product_id, p.name, p.description, p.price, p.image_url, p.category 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = $1`,
    [userId]
  );
  return res.rows;
};

const addItem = async (userId, productId, quantity = 1) => {
  const res = await db.query(
    `INSERT INTO cart (user_id, product_id, quantity) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity 
     RETURNING *`,
    [userId, productId, quantity]
  );
  return res.rows[0];
};

const updateQuantity = async (cartId, userId, quantity) => {
  const res = await db.query(
    'UPDATE cart SET quantity = $1 WHERE (id = $2 OR product_id = $2) AND user_id = $3 RETURNING *',
    [quantity, cartId, userId]
  );
  return res.rows[0];
};

const removeItem = async (cartId, userId) => {
  const res = await db.query(
    'DELETE FROM cart WHERE (id = $1 OR product_id = $1) AND user_id = $2 RETURNING *',
    [cartId, userId]
  );
  return res.rows[0];
};

module.exports = {
  findByUserId,
  addItem,
  updateQuantity,
  removeItem
};

