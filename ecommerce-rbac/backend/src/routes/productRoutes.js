const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const { uploadSingleImage } = require('../middleware/upload');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes (admin and sales/sales_person only)
router.post('/', authMiddleware, roleGuard('admin', 'sales_person', 'sales'), uploadSingleImage, createProduct);
router.put('/:id', authMiddleware, roleGuard('admin', 'sales_person', 'sales'), uploadSingleImage, updateProduct);
router.delete('/:id', authMiddleware, roleGuard('admin', 'sales_person', 'sales'), deleteProduct);

module.exports = router;

