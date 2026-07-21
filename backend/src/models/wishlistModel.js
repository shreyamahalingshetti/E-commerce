const db = require('../config/db');

const findByUserId = async (userId) => {
  const res = await db.query(
    `SELECT w.id, p.id as product_id, p.name, p.description, p.price, p.image_url, p.category 
     FROM wishlist w 
     JOIN products p ON w.product_id = p.id 
     WHERE w.user_id = $1`,
    [userId]
  );
  return res.rows;
};

const addItem = async (userId, productId) => {
  const res = await db.query(
    `INSERT INTO wishlist (user_id, product_id) 
     VALUES ($1, $2) 
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET product_id = EXCLUDED.product_id 
     RETURNING *`,
    [userId, productId]
  );
  return res.rows[0];
};

const removeItem = async (id, userId) => {
  const res = await db.query(
    'DELETE FROM wishlist WHERE (id = $1 OR product_id = $1) AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return res.rows[0];
};

module.exports = {
  findByUserId,
  addItem,
  removeItem
};

