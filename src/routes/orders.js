/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import Order from "../models/order";

const { requireAuth } = require("../middleware/auth");

module.exports = (app, nextMain) => {
  app.get("/orders", requireAuth, async (req, res, next) => {
    const orders = await Order.find();
    res.json(orders);
  });

  app.get("/orders/:orderId", requireAuth, async (req, res, next) => {
    const orderFound = await Order.findById(req.params.orderId);
    res.json(orderFound);
  });

  app.post("/orders", requireAuth, async (req, res, next) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
  });

  app.put("/orders/:orderId", requireAuth, async (req, res, next) => {
    const orderUpdated = await Order.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true },
    );
    res.json(orderUpdated);
  });

  app.delete("/orders/:orderId", requireAuth, async (req, res, next) => {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    res.json(deletedOrder);
  });

  nextMain();
};
