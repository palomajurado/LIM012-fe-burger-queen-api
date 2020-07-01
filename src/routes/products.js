/* eslint-disable linebreak-style */
/* eslint-disable import/newline-after-import */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import Product from "../models/product";
const { requireAuth, requireAdmin } = require("../middleware/auth");

module.exports = (app, nextMain) => {
  app.get("/products", requireAuth, async (req, res, next) => {
    const products = await Product.find();
    res.json(products);
  });

  app.get("/products/:productId", requireAuth, (req, res, next) => {});

  app.post("/products", requireAdmin, async (req, res, next) => {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  });

  app.put("/products/:productId", requireAdmin, (req, res, next) => {});

  app.delete("/products/:productId", requireAdmin, (req, res, next) => {});

  nextMain();
};
