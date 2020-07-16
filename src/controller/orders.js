import Order from "../models/order";
import Product from "../models/product";

module.exports = {
  getOrders: async (req, res) => {
    const orders = await Order.find().populate("products.productId");
    res.json(orders);
  },
  getOneOrder: async (req, res) => {
    const orderFound = await Order.findById(req.params.orderId);
    res.json(orderFound);
  },
  createOrder: async (req, res, next) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
  },
  updateOrder: async (req, res, next) => {
    const orderUpdated = await Order.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true }
    );
    res.json(orderUpdated);
  },
  deleteOrder: async (req, res, next) => {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    res.json({ order: deletedOrder });
  },
};
