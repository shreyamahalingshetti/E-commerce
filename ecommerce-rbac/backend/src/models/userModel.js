const db = require('../config/db');

exports.findByEmail = async (email) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

exports.findById = async (id) => {
  const res = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
  return res.rows[0];
};

exports.createUser = async (name, email, password, role = 'user') => {
  const res = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
    [name, email, password, role]
  );
  return res.rows[0];
};
