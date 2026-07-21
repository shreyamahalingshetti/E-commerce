const bcrypt = require('bcryptjs');

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

const comparePassword = async (plainPassword, hash) => {
  if (!plainPassword || !hash) return false;
  return bcrypt.compare(plainPassword, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};
