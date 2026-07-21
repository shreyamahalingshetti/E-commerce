const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authenticate = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (admin and sales_person only)
router.post('/', authenticate, roleGuard('admin', 'sales_person', 'sales'), createProduct);
router.put('/:id', authenticate, roleGuard('admin', 'sales_person', 'sales'), updateProduct);
router.delete('/:id', authenticate, roleGuard('admin', 'sales_person', 'sales'), deleteProduct);

module.exports = router;
