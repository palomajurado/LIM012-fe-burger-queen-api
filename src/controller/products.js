import Product from "../models/product";

module.exports = {
  getProducts: async (req, res) => {
    const products = await Product.find();
    res.json(products);
  },
  getOneProduct: async (req, res) => {
    const productFound = await Product.findById(req.params.productId);
    res.json(productFound);
  },
  createProduct: async (req, res, next) => {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  },
  updateProduct: async (req, res, next) => {
    const productUpdated = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    res.json(productUpdated);
  },
  deleteProduct: async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId
    );
    res.json({ product: deletedProduct });
  },
};
