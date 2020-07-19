import Product from "../models/product";
import { getPagination } from "../utils/utils";

module.exports = {
  getProducts: async (req, res) => {
    const url = `${req.protocol}://${req.get("host")}${req.path}`;
    const options = {
      limit: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
    };
    const responsePaginated = await Product.paginate({}, options);

    res.set(
      "link",
      getPagination(
        url,
        options.page,
        options.limit,
        responsePaginated.totalPages
      )
    );
    if (!responsePaginated) {
      next(401);
    }
    res.json({ products: responsePaginated.docs });
  },
  getOneProduct: async (req, res) => {
    const productFound = await Product.findById(req.params.productId);
    if (!productFound) {
      return next(404);
    }
    res.json({ product: productFound });
  },
  createProduct: async (req, res, next) => {
    const newProduct = await Product.create(req.body);
    res.json({ product: newProduct });
  },
  updateProduct: async (req, res, next) => {
    const productUpdated = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    res.json({ product: productUpdated });
  },
  deleteProduct: async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId
    );
    if (!deletedProduct) {
      next(404);
    }
    res.json({ product: deletedProduct });
  },
};
