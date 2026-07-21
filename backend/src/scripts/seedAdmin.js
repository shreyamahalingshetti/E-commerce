const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = require('../config/db');
const userModel = require('../models/userModel');
const { hashPassword } = require('../utils/hash');

async function seedAdmin() {
  try {
    let name = process.env.SEED_ADMIN_NAME;
    let email = process.env.SEED_ADMIN_EMAIL;
    let password = process.env.SEED_ADMIN_PASSWORD;

    if (!name || !email || !password) {
      console.warn('⚠️ Warning: SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, or SEED_ADMIN_PASSWORD env vars are not fully set. Using default credentials.');
      name = name || 'Admin';
      email = email || 'admin@example.com';
      password = password || 'ChangeMe123!';
    }

    // Check if user with this email already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      console.log(`ℹ️ Admin user (${email}) already exists, skipping.`);
      await db.pool.end();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new admin user
    const adminUser = await userModel.createUser({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'admin',
      businessName: null
    });

    console.log(`✅ Admin user created successfully with email: ${adminUser.email}`);
    await db.pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed admin user:', err);
    try {
      await db.pool.end();
    } catch (e) {
      // ignore cleanup error
    }
    process.exit(1);
  }
}

seedAdmin();
