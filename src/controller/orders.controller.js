import Order from '../models/order.model';
import Product from '../models/product.model';

module.exports = {
  deleteOrder: async (req, res, next) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
      res.json(deletedOrder);
    } catch (err) {
      next(404);
    }
  },
  getOrders: async (req, res) => {
    const orders = await Order.find().populate('products.productId');
    res.json(orders);
  },
  getOneOrder: async (req, res, next) => {
    try {
      const orderFound = await Order.findById(req.params.orderId);
      if (!orderFound) next(404);
      res.json(orderFound);
    } catch (error) {
      next(404);
    }
  },
  createOrder: async (req, res, next) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
  },
  updateOrder: async (req, res, next) => {
    try {
      const states = ['pending', 'canceled', 'delivering', 'delivered'];
      const currOrder = await Order.findById(req.params.orderId);
      // if (!currOrder) next(404);
      if (Object.keys(req.body).length === 0) next(400);
      if (req.body.products) {
        const productsArray = await Product.find({ _id: { $in: req.body.products.map((p) => p.productId) } });
        req.body.products = req.body.products.map((item, key) => ({
          productId: item.productId,
          product: {
            name: productsArray[key].name,
            price: productsArray[key].price,
          },
          qty: item.qty,
        }));
        // console.log('hay productos');
      }
      if (req.body.status !== undefined && !states.includes(req.body.status)) {
        next(400);
      } else {
        if (req.body.status === 'delivered') req.body.dateProcessed = Date.now();
        // console.log(req.body);
        const orderUpdated = await Order.findByIdAndUpdate(
          req.params.orderId,
          req.body,
          { new: true },
        );
        res.json(orderUpdated);
      }
    } catch (error) {
      next(404);
    }
    const orderUpdated = await Order.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true },
    );
    res.json(orderUpdated);
  },
};
