/* eslint-disable max-len */
const mongodb = require('mongodb');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
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
      next(401);
    }
    // res.json({ orders: responsePaginated.docs });
    res.json(responsePaginated.docs);
  },
  getOneOrder: async (req, res, next) => {
    try {
      const orderFound = await Order.findById(req.params.orderId).populate(
        'products.product',
      );
      res.json(orderFound);
    } catch (error) {
      next(404);
    }
  },
  createOrder: async (req, res, next) => {
    const order = req.body;
    if (!order.products || order.products.length === 0) next(400);
    const newOrder = new Order({
      ...req.body,
      products: req.body.products.map((product) => ({
        qty: product.qty,
        product: product.productId,
      })),
    });
    const newOrderSaved = await newOrder.save();
    console.log(newOrderSaved);

    const populatedOrder = await newOrderSaved
      .populate('products.product')
      .execPopulate();
    // console.log(populatedOrder);
    res.json(populatedOrder);
  },
  updateOrder: async (req, res, next) => {
    const order = req.body;
    try {
      if (!order.userId && !order.client && !order.products && !order.status) {
        console.log(order.userId, order.client, order.products, order.status);
        console.log('error 1');
        next(400);
      }
      // CHEQUEAR RESTRICCIONES EN ESTA LINEA
      const statusOrder = ['pending', 'canceled', 'delivering', 'delivered', 'preparing'];
      if (order.status && !statusOrder.includes(order.status)) {
        console.log('error 2');
        next(400);
      }

      const orderUpdated = await Order.findByIdAndUpdate(
        req.params.orderId,
        req.body,
        { new: true },
      ).lean();

      res.json({
        ...orderUpdated,
        products: orderUpdated.products.map((product) => ({
          productId: product.product,
          qty: product.qty,
        })),
      });
    } catch (error) {
      next(404);
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(
        req.params.orderId,
      ).populate('products.product');
      // console.log(deletedOrder);
      res.json(deletedOrder);
    } catch (error) {
      next(404);
    }
  },
};
