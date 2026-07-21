const db = require('../config/db');

const getAll = async (filters = {}) => {
  const { category, minPrice, maxPrice, keyword, search } = filters;
  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  if (minPrice !== undefined && minPrice !== '') {
    values.push(parseFloat(minPrice));
    conditions.push(`price >= $${values.length}`);
  }

  if (maxPrice !== undefined && maxPrice !== '') {
    values.push(parseFloat(maxPrice));
    conditions.push(`price <= $${values.length}`);
  }

  const searchTerm = keyword || search;
  if (searchTerm) {
    values.push(`%${searchTerm}%`);
    conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT * FROM products ${whereClause} ORDER BY created_at DESC`;

  const res = await db.query(query, values);
  return res.rows;
};

const getById = async (id) => {
  const res = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return res.rows[0];
};

const create = async ({ name, description, price, stock, image_url, category, owner_id }) => {
  const res = await db.query(
    `INSERT INTO products (name, description, price, stock, image_url, category, owner_id) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, description, price, stock || 0, image_url, category, owner_id]
  );
  return res.rows[0];
};

const update = async (id, fields) => {
  const allowedKeys = ['name', 'description', 'price', 'stock', 'image_url', 'category'];
  const keys = Object.keys(fields).filter((k) => allowedKeys.includes(k) && fields[k] !== undefined);

  if (keys.length === 0) return getById(id);

  const setString = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map((k) => fields[k]);

  const res = await db.query(
    `UPDATE products SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return res.rows[0];
};

const remove = async (id) => {
  const res = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

const checkOwnership = async (productId, userId) => {
  const res = await db.query('SELECT owner_id FROM products WHERE id = $1', [productId]);
  if (!res.rows.length) return null;
  return Number(res.rows[0].owner_id) === Number(userId);
};

module.exports = {
  getAll,
  findAll: getAll,
  getById,
  findById: getById,
  create,
  update,
  delete: remove,
  remove,
  checkOwnership
};

