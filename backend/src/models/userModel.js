const db = require('../config/db');

const findByEmail = async (email) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const findById = async (id) => {
  const res = await db.query(
    'SELECT id, name, email, role, business_name, created_at FROM users WHERE id = $1',
    [id]
  );
  return res.rows[0];
};

const createUser = async (dataOrName, emailParam, passwordParam, roleParam = 'user', businessNameParam = null) => {
  let name, email, passwordHash, role, businessName;

  if (typeof dataOrName === 'object' && dataOrName !== null) {
    name = dataOrName.name;
    email = dataOrName.email;
    passwordHash = dataOrName.passwordHash || dataOrName.password_hash || dataOrName.password;
    role = dataOrName.role || 'user';
    businessName = dataOrName.businessName !== undefined ? dataOrName.businessName : dataOrName.business_name;
  } else {
    name = dataOrName;
    email = emailParam;
    passwordHash = passwordParam;
    role = roleParam;
    businessName = businessNameParam;
  }

  try {
    const res = await db.query(
      'INSERT INTO users (name, email, password_hash, role, business_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, business_name, created_at',
      [name, email, passwordHash, role, businessName || null]
    );
    return res.rows[0];
  } catch (err) {
    if (err.message && err.message.includes('password_hash')) {
      const res = await db.query(
        'INSERT INTO users (name, email, password, role, business_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, business_name, created_at',
        [name, email, passwordHash, role, businessName || null]
      );
      return res.rows[0];
    }
    throw err;
  }
};

module.exports = {
  findByEmail,
  findById,
  createUser
};
