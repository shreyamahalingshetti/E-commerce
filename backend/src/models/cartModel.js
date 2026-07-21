const db = require('../config/db');

const queryWithFallback = async (queryCartItems, queryCart, params) => {
  try {
    return await db.query(queryCartItems, params);
  } catch (err) {
    if (err.code === '42P01') {
      return await db.query(queryCart, params);
    }
    throw err;
  }
};

const getCartByUser = async (userId) => {
  const res = await queryWithFallback(
    `SELECT c.id, c.quantity, c.product_id, p.name, p.description, p.price, p.image_url, p.category, p.owner_id as owner_id, p.owner_id as seller_id 
     FROM cart_items c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    `SELECT c.id, c.quantity, c.product_id, p.name, p.description, p.price, p.image_url, p.category, p.owner_id as owner_id, p.owner_id as seller_id 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return res.rows;
};

const upsertCartItem = async (userId, productId, quantity = 1) => {
  const qty = parseInt(quantity, 10) || 1;
  const res = await queryWithFallback(
    `INSERT INTO cart_items (user_id, product_id, quantity) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity 
     RETURNING *`,
    `INSERT INTO cart (user_id, product_id, quantity) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity 
     RETURNING *`,
    [userId, productId, qty]
  );
  return res.rows[0];
};

const setCartItemQuantity = async (userId, productId, quantity) => {
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) {
    return await removeCartItem(userId, productId);
  }
  const res = await queryWithFallback(
    `UPDATE cart_items SET quantity = $3 
     WHERE user_id = $1 AND (product_id = $2 OR id = $2) 
     RETURNING *`,
    `UPDATE cart SET quantity = $3 
     WHERE user_id = $1 AND (product_id = $2 OR id = $2) 
     RETURNING *`,
    [userId, productId, qty]
  );
  return res.rows[0];
};

const removeCartItem = async (userId, productId) => {
  const res = await queryWithFallback(
    `DELETE FROM cart_items 
     WHERE user_id = $1 AND (product_id = $2 OR id = $2) 
     RETURNING *`,
    `DELETE FROM cart 
     WHERE user_id = $1 AND (product_id = $2 OR id = $2) 
     RETURNING *`,
    [userId, productId]
  );
  return res.rows[0];
};

const clearCart = async (userId) => {
  const res = await queryWithFallback(
    `DELETE FROM cart_items WHERE user_id = $1 RETURNING *`,
    `DELETE FROM cart WHERE user_id = $1 RETURNING *`,
    [userId]
  );
  return res.rows;
};

module.exports = {
  getCartByUser,
  upsertCartItem,
  setCartItemQuantity,
  removeCartItem,
  clearCart,

  // Backwards compatibility
  findByUserId: getCartByUser,
  addItem: upsertCartItem,
  updateQuantity: (cartId, userId, quantity) => setCartItemQuantity(userId, cartId, quantity),
  removeItem: (cartId, userId) => removeCartItem(userId, cartId)
};
