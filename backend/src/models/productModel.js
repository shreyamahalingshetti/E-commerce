const db = require('../config/db');

const getAll = async (filters = {}) => {
  const { category, minPrice, maxPrice, keyword, search, owner_id } = filters;
  const conditions = [];
  const values = [];

  if (owner_id) {
    values.push(owner_id);
    conditions.push(`p.owner_id = $${values.length}`);
  }

  if (category) {
    values.push(category);
    conditions.push(`p.category = $${values.length}`);
  }

  if (minPrice !== undefined && minPrice !== '' && !isNaN(parseFloat(minPrice))) {
    values.push(parseFloat(minPrice));
    conditions.push(`p.price >= $${values.length}`);
  }

  if (maxPrice !== undefined && maxPrice !== '' && !isNaN(parseFloat(maxPrice))) {
    values.push(parseFloat(maxPrice));
    conditions.push(`p.price <= $${values.length}`);
  }

  const searchTerm = keyword || search;
  if (searchTerm && searchTerm.trim()) {
    values.push(`%${searchTerm.trim()}%`);
    conditions.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT p.*, u.name AS owner_name, u.business_name AS shop_name
    FROM products p
    LEFT JOIN users u ON p.owner_id = u.id
    ${whereClause}
    ORDER BY p.created_at DESC;
  `;

  const res = await db.query(query, values);
  return res.rows;
};

const getById = async (id) => {
  const query = `
    SELECT p.*, u.name AS owner_name, u.business_name AS shop_name
    FROM products p
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE p.id = $1;
  `;
  const res = await db.query(query, [id]);
  return res.rows[0];
};

const create = async (data) => {
  const {
    name,
    description,
    price,
    stock,
    category,
    imageUrl,
    image_url,
    ownerId,
    owner_id
  } = data;

  const finalImageUrl = imageUrl !== undefined ? imageUrl : image_url;
  const finalOwnerId = ownerId !== undefined ? ownerId : owner_id;

  const res = await db.query(
    `INSERT INTO products (name, description, price, stock, image_url, category, owner_id) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, description || null, price, stock || 0, finalImageUrl || null, category || null, finalOwnerId]
  );
  return res.rows[0];
};

const update = async (id, fields) => {
  const allowedKeysMap = {
    name: 'name',
    description: 'description',
    price: 'price',
    stock: 'stock',
    category: 'category',
    imageUrl: 'image_url',
    image_url: 'image_url'
  };

  const updateFields = {};
  Object.keys(fields).forEach((key) => {
    if (allowedKeysMap[key] && fields[key] !== undefined) {
      updateFields[allowedKeysMap[key]] = fields[key];
    }
  });

  const keys = Object.keys(updateFields);
  if (keys.length === 0) return getById(id);

  const setString = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map((k) => updateFields[k]);

  const res = await db.query(
    `UPDATE products SET ${setString}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
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
  if (!res.rows.length) return false;
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
