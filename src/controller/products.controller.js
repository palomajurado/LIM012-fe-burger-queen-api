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
    if (!responsePaginated) {
      next(404);
    }
    res.json({ products: responsePaginated.docs });
  },
  getOneProduct: async (req, res, next) => {
    const productFound = await Product.findById(req.params.productId);
    if (!productFound) {
      return next(404);
    }
    res.json({ product: productFound });
  },
  createProduct: async (req, res, next) => {
    try {
      // cuando no se indica nombre o precio del producto a crear
      if (!req.body.name || !req.body.price) next(400);
      const newProduct = await Product.create(req.body);
      res.json({ product: newProduct });
    } catch (error) {
      // error cuando ya existe un producto con el mismo nombre
      next(404);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      // cuando no se indican propiedades a  modificar
      if (Object.keys(req.body).length === 0) next(400);

      const productUpdated = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        { new: true },
      );
      res.json({ product: productUpdated });
    } catch (error) {
      // cuando el producto a actualizar no existe
      next(404);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(
        req.params.productId,
      );
      res.json({ product: deletedProduct });
    } catch (error) {
      // el producto a eliminar no existe
      next(404);
    }
  },
};
