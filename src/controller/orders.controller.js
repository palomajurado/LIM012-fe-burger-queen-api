/* eslint-disable max-len */
// const mongodb = require('mongodb');
const Order = require('../models/order.model');
// const Product = require('../models/product.model');
const { getPagination } = require('../utils/utils');

module.exports = {
  getOrders: async (req, res, next) => {
    const url = `${req.protocol}://${req.get('host')}${req.path}`;
    const options = {
      populate: 'products.product',
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
    };
    const responsePaginated = await Order.paginate({}, options);
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
      return next(401);
    }
    return res.json(responsePaginated.docs);
  },
  getOneOrder: async (req, res, next) => {
    try {
      const orderFound = await Order.findById(req.params.orderId).populate(
        'products.product',
      );
      return res.json(orderFound);
    } catch (error) {
      return next(404);
    }
  },
  createOrder: async (req, res, next) => {
    const order = req.body;
    if (!order.products || order.products.length === 0) return next(400);
    const newOrder = new Order({
      ...req.body,
      products: req.body.products.map((product) => ({
        qty: product.qty,
        product: product.productId,
      })),
    });
    const newOrderSaved = await newOrder.save();

    const populatedOrder = await newOrderSaved
      .populate('products.product')
      .execPopulate();
    return res.json(populatedOrder);
  },
  updateOrder: async (req, res, next) => {
    const order = req.body;
    try {
      if (!order.userId && !order.client && !order.products && !order.status) return next(400);
      // CHEQUEAR RESTRICCIONES EN ESTA LINEA
      const statusOrder = ['pending', 'canceled', 'delivering', 'delivered', 'preparing'];
      if (order.status && !statusOrder.includes(order.status)) return next(400);

      if (order.status === 'delivered') {
        order.dateProcessed = Date.now();
      }

      const orderUpdated = await Order.findByIdAndUpdate(
        req.params.orderId,
        order,
        { new: true },
      ).lean();

      return res.json({
        ...orderUpdated,
        products: orderUpdated.products.map((product) => ({
          productId: product.product,
          qty: product.qty,
        })),
      });
    } catch (error) {
      return next(404);
    }
  },
  deleteOrder: async (req, res, next) => {
    const order = req.body;
    console.log(order);
    try {
      if (order.status === 'delivered') {
        order.dateProcessed = Date.now();
      }
      const deletedOrder = await Order.findByIdAndRemove(
        req.params.orderId,
      ).populate('products.product');
      const statusOrder = ['pending', 'canceled', 'delivering', 'delivered'];

      if (!deletedOrder || !statusOrder.includes(deletedOrder.status)) return next(404);
      return res.json(deletedOrder);
    } catch (error) {
      return next(404);
    }
  },
};
