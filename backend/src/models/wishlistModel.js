const db = require('../config/db');

const queryWithFallback = async (queryItems, queryLegacy, params) => {
  try {
    return await db.query(queryItems, params);
  } catch (err) {
    if (err.code === '42P01') {
      return await db.query(queryLegacy, params);
    }
    throw err;
  }
};

const getWishlistByUser = async (userId) => {
  const res = await queryWithFallback(
    `SELECT w.id, w.product_id, p.name, p.description, p.price, p.image_url, p.category 
     FROM wishlist_items w 
     JOIN products p ON w.product_id = p.id 
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    `SELECT w.id, w.product_id, p.name, p.description, p.price, p.image_url, p.category 
     FROM wishlist w 
     JOIN products p ON w.product_id = p.id 
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    [userId]
  );
  return res.rows;
};

const addWishlistItem = async (userId, productId) => {
  const res = await queryWithFallback(
    `INSERT INTO wishlist_items (user_id, product_id) 
     VALUES ($1, $2) 
     ON CONFLICT (user_id, product_id) DO NOTHING 
     RETURNING *`,
    `INSERT INTO wishlist (user_id, product_id) 
     VALUES ($1, $2) 
     ON CONFLICT (user_id, product_id) DO NOTHING 
     RETURNING *`,
    [userId, productId]
  );
  return res.rows[0];
};

const removeWishlistItem = async (userId, productId) => {
  const res = await queryWithFallback(
    `DELETE FROM wishlist_items 
     WHERE user_id = $1 AND (product_id = $2 OR id = $2) 
     RETURNING *`,
    `DELETE FROM wishlist 
     WHERE user_id = $1 AND (product_id = $2 OR id = $2) 
     RETURNING *`,
    [userId, productId]
  );
  return res.rows[0];
};

const toggleItem = async (userId, productId) => {
  const existing = await getWishlistByUser(userId);
  const isMatch = existing.some(item => Number(item.product_id) === Number(productId) || Number(item.id) === Number(productId));
  if (isMatch) {
    await removeWishlistItem(userId, productId);
    return { added: false, message: 'Removed from wishlist' };
  } else {
    await addWishlistItem(userId, productId);
    return { added: true, message: 'Added to wishlist' };
  }
};

module.exports = {
  getWishlistByUser,
  addWishlistItem,
  removeWishlistItem,
  toggleItem,

  // Backwards compatibility
  findByUserId: getWishlistByUser,
  addItem: addWishlistItem,
  removeItem: (id, userId) => removeWishlistItem(userId, id)
};
