const productModel = require('../models/productModel');

const getAllProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, keyword, search } = req.query;
    const products = await productModel.getAll({ category, minPrice, maxPrice, keyword, search });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const owner_id = req.user.id;
    const newProduct = await productModel.create({
      name,
      description,
      price: parseFloat(price),
      stock: stock ? parseInt(stock, 10) : 0,
      image_url: image_url || null,
      category: category || null,
      owner_id
    });

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Role ownership check: admin can edit any product; sales_person/sales can only edit their own
    if (req.user.role !== 'admin' && Number(product.owner_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own products' });
    }

    const { name, description, price, stock, category, image_url } = req.body;
    const updateData = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(stock !== undefined && { stock: parseInt(stock, 10) }),
      ...(category !== undefined && { category }),
      ...(image_url !== undefined && { image_url })
    };

    const updatedProduct = await productModel.update(id, updateData);
    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Role ownership check: admin can delete any product; sales_person/sales can only delete their own
    if (req.user.role !== 'admin' && Number(product.owner_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own products' });
    }

    await productModel.remove(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

