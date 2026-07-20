const db = require('../config/db');

exports.findByUserId = async (userId) => {
  const res = await db.query(
    `SELECT w.id, p.id as product_id, p.name, p.price, p.image_url 
     FROM wishlist w 
     JOIN products p ON w.product_id = p.id 
     WHERE w.user_id = $1`,
    [userId]
  );
  return res.rows;
};

exports.toggle = async (userId, productId) => {
  const check = await db.query('SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2', [userId, productId]);
  if (check.rows.length > 0) {
    await db.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    return { added: false, message: 'Removed from wishlist' };
  } else {
    await db.query('INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)', [userId, productId]);
    return { added: true, message: 'Added to wishlist' };
  }
};
