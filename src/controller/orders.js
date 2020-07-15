<<<<<<< HEAD
/* eslint-disable max-len */
=======
>>>>>>> b9187d804052a387f941594f27473afba0d72a41
import Order from '../models/order';
import Product from '../models/product';

module.exports = {
  getOrders: async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
  },
  getOneOrder: async (req, res) => {
    const orderFound = await Order.findById(req.params.orderId);
    res.json(orderFound);
  },
  createOrder: async (req, res, next) => {
    const productsArray = await Product.find({ _id: { $in: req.body.products.map((p) => p.productId) } });

    req.body.products = req.body.products.map((item, key) => ({
      product: {
        _id: item.productId,
        name: productsArray[key].name,
        price: productsArray[key].price,
      },
      qty: item.qty,
    }));

    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
  },
  updateOrder: async (req, res, next) => {
    const orderUpdated = await Order.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true },
    );
    res.json(orderUpdated);
  },
  deleteOrder: async (req, res, next) => {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    res.json(deletedOrder);
  },
};
