const userModel = require('../models/userModel');

const listUsers = async (req, res, next) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const newRole = req.body.newRole || req.body.role;
    const validRoles = ['user', 'sales_person', 'admin'];

    if (!newRole || !validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    if (Number(userId) === Number(req.user.id)) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const updatedUser = await userModel.updateUserRole(userId, newRole);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  updateRole
};
