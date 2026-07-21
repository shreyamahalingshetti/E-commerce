const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const signToken = (payload) => {
  return jwt.sign(
    { id: payload.id, role: payload.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  signToken,
  generateToken: signToken,
  verifyToken
};

