const productModel = require('../models/productModel');
const cloudinary = require('../config/cloudinary');

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productModel.findAll();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    let image_url = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image_url = result.secure_url;
    }
    const newProduct = await productModel.create({ name, description, price, stock, image_url, category });
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    let image_url = undefined;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image_url = result.secure_url;
    }
    const updated = await productModel.update(req.params.id, { name, description, price, stock, image_url, category });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productModel.remove(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
