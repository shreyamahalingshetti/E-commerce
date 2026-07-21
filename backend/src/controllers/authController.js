const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, businessName, business_name } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const userRole = role || 'user';

    // Only allow role to be 'user' or 'sales_person' — reject any other value with 400
    if (userRole !== 'user' && userRole !== 'sales_person') {
      return res.status(400).json({ error: "Invalid role. Allowed roles are 'user' or 'sales_person'" });
    }

    const finalBusinessName = (businessName !== undefined ? businessName : business_name || '').trim();

    // If role === 'sales_person', require businessName to be non-empty, else 400
    if (userRole === 'sales_person' && !finalBusinessName) {
      return res.status(400).json({ error: 'Business / Shop Name is required for sales persons' });
    }

    // Check email isn't already registered (409 if so)
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const businessNameValue = userRole === 'sales_person' ? finalBusinessName : null;

    const newUser = await userModel.createUser({
      name,
      email,
      passwordHash: hashedPassword,
      role: userRole,
      businessName: businessNameValue
    });

    const token = signToken({ id: newUser.id, role: newUser.role });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        business_name: newUser.business_name || null
      },
      token
    });
  } catch (err) {
    console.error('Error in register:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const storedHash = user.password_hash || user.password;
    const isMatch = await comparePassword(password, storedHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, role: user.role });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        business_name: user.business_name || null
      },
      token
    });
  } catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    delete user.password_hash;
    delete user.password;
    return res.status(200).json(user);
  } catch (err) {
    console.error('Error in getMe:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getProfile: getMe
};
