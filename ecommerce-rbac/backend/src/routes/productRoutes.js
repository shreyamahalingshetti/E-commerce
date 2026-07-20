const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const upload = require('../middleware/upload');

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Restricted to admin and sales
router.post('/', authMiddleware, roleGuard('admin', 'sales'), upload.single('image'), createProduct);
router.put('/:id', authMiddleware, roleGuard('admin', 'sales'), upload.single('image'), updateProduct);
router.delete('/:id', authMiddleware, roleGuard('admin', 'sales'), deleteProduct);

module.exports = router;
