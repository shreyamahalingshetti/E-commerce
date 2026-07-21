const jwt = require('jsonwebtoken');

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your_secret_key';
  return jwt.sign(
    { id: payload.id, role: payload.role },
    secret,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your_secret_key';
  return jwt.verify(token, secret);
};

module.exports = {
  signToken,
  generateToken: signToken,
  verifyToken
};
