import Product from '../models/product.model';
// import { uidOrEmail } from './utils';

module.exports = {
  deleteProduct: async (req, res, next) => {
    try {
      // const obj = uidOrEmail(req.params.uid);
      const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
      res.json(deletedProduct);
    } catch (err) {
      next(404);
    }
  },
  getProducts: async (req, res) => {
    const products = await Product.find();
    res.json(products);
  },
  getOneProduct: async (req, res, next) => {
    try {
      const productFound = await Product.findById(req.params.productId);
      res.json(productFound);
    } catch (err) {
      next(404);
    }
  },
  createProduct: async (req, res, next) => {
    try {
      if (!req.body.name || !req.body.price) next(400);
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      next(404);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      if (Object.keys(req.body).length === 0) {
        next(404);
      }
      const productUpdated = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        { new: true },
      );
      res.json(productUpdated);
    } catch (error) {
      next(404);
    }
    const productUpdated = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true },
    );
    res.json(productUpdated);
  },
};
