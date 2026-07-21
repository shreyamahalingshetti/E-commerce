-- Migration: Add business_name to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
