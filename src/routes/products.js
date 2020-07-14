/* eslint-disable no-unused-vars */
import Product from '../models/product';
// const { Product } = require('../models/product');

const { requireAuth, requireAdmin } = require('../middleware/auth');

module.exports = (app, nextMain) => {
  app.get('/products', requireAuth, async (req, res, next) => {
    const products = await Product.find();
    res.json(products);
  });

  app.get('/products/:productId', requireAuth, async (req, res, next) => {
    const productFound = await Product.findById(req.params.productId);
    res.json(productFound);
  });

  app.post('/products', requireAdmin, async (req, res, next) => {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  });

  app.put('/products/:productId', requireAdmin, async (req, res, next) => {
    const productUpdated = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true },
    );
    res.json(productUpdated);
  });

  app.delete('/products/:productId', requireAdmin, async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId,
    );
    res.json(deletedProduct);
  });

  nextMain();
};
