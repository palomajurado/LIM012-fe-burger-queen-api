const Product = require('../models/product.model');
const { getPagination } = require('../utils/utils');

module.exports = {
  getProducts: async (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}${req.path}`;
    const options = {
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
    };
    const responsePaginated = await Product.paginate({}, options);
    res.set(
      'link',
      getPagination(
        url,
        options.page,
        options.limit,
        responsePaginated.totalPages,
      ),
    );
    if (!responsePaginated) next(404);
    res.json(responsePaginated.docs);
  },
  getOneProduct: async (req, res, next) => {
    try {
      const productFound = await Product.findById(req.params.productId);
      if (!productFound) next(404);
      res.json(productFound);
    } catch (error) {
      next(404);
    }
  },
  createProduct: async (req, res, next) => {
    const product = req.body;
    try {
      if (!product.name || !product.price) next(400);
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      next(404);
    }
  },
  updateProduct: async (req, res, next) => {
    const product = req.body;
    try {
      if (Object.keys(product).length === 0 || typeof (product.price) !== 'number') next(400);

      const productUpdated = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        { new: true },
      );
      res.json(productUpdated);
    } catch (error) {
      next(404);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(
        req.params.productId,
      );
      res.json(deletedProduct);
    } catch (error) {
      next(404);
    }
  },
};
