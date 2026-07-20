const db = require('../config/db');

exports.findAll = async () => {
  const res = await db.query('SELECT * FROM products ORDER BY created_at DESC');
  return res.rows;
};

exports.findById = async (id) => {
  const res = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return res.rows[0];
};

exports.create = async ({ name, description, price, stock, image_url, category }) => {
  const res = await db.query(
    'INSERT INTO products (name, description, price, stock, image_url, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, description, price, stock, image_url, category]
  );
  return res.rows[0];
};

exports.update = async (id, fields) => {
  const keys = Object.keys(fields).filter(k => fields[k] !== undefined);
  const setString = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map(k => fields[k]);
  
  if (!keys.length) return exports.findById(id);
  
  const res = await db.query(
    `UPDATE products SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return res.rows[0];
};

exports.remove = async (id) => {
  await db.query('DELETE FROM products WHERE id = $1', [id]);
  return true;
};
