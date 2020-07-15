/* eslint-disable no-unused-vars */
import Product from '../models/product';

const {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/products');

const { requireAuth, requireAdmin } = require('../middleware/auth');

module.exports = (app, nextMain) => {
  app.get('/products', requireAuth, getProducts);

  app.get('/products/:productId', requireAuth, getOneProduct);

  app.post('/products', requireAdmin, createProduct);

  app.put('/products/:productId', requireAdmin, updateProduct);

  app.delete('/products/:productId', requireAdmin, deleteProduct);

  nextMain();
};
