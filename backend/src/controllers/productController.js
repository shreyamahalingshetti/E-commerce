const productModel = require('../models/productModel');

const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, keyword, search, owner_id } = req.query;
    const products = await productModel.getAll({ category, minPrice, maxPrice, keyword, search, owner_id });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error in getProducts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Error in getProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, imageUrl, image_url } = req.body;

    const numericPrice = parseFloat(price);
    if (!name || isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: 'Product name and a positive price are required' });
    }

    const owner_id = req.user.id;
    const finalImageUrl = imageUrl !== undefined ? imageUrl : image_url;

    const newProduct = await productModel.create({
      name: name.trim(),
      description: description ? description.trim() : null,
      price: numericPrice,
      stock: stock ? parseInt(stock, 10) : 0,
      imageUrl: finalImageUrl || null,
      category: category ? category.trim() : null,
      owner_id
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error in createProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (req.user.role !== 'admin') {
      const isOwner = await productModel.checkOwnership(id, req.user.id);
      if (!isOwner) {
        return res.status(403).json({ error: 'Forbidden — insufficient permissions' });
      }
    }

    const { name, description, price, stock, category, imageUrl, image_url } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
      }
      updateData.price = parsedPrice;
    }
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (category !== undefined) updateData.category = category.trim();

    const finalImageUrl = imageUrl !== undefined ? imageUrl : image_url;
    if (finalImageUrl !== undefined) updateData.imageUrl = finalImageUrl;

    const updatedProduct = await productModel.update(id, updateData);
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error in updateProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (req.user.role !== 'admin') {
      const isOwner = await productModel.checkOwnership(id, req.user.id);
      if (!isOwner) {
        return res.status(403).json({ error: 'Forbidden — insufficient permissions' });
      }
    }

    await productModel.remove(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  getAllProducts: getProducts,
  getProduct,
  getProductById: getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
