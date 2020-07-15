/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import Order from "../models/order";
import Products from "../models/product";

const mongodb = require('mongodb');

const { requireAuth } = require("../middleware/auth");

const { 
  getOrders,
  getOneOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controller/orders');

module.exports = (app, nextMain) => {
  app.get("/orders", requireAuth, getOrders);

  app.get("/orders/:orderId", requireAuth, getOneOrder);

  app.post("/orders", requireAuth, createOrder);

  app.put("/orders/:orderId", requireAuth, updateOrder);

  app.delete("/orders/:orderId", requireAuth, deleteOrder);

  nextMain();
};
