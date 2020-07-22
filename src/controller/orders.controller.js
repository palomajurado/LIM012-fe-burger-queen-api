const Order = require('../models/order.model');
const { getPagination } = require('../utils/utils');

module.exports = {
  getOrders: async (req, res) => {
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
    res.json({ orders: responsePaginated.docs });
  },
  getOneOrder: async (req, res) => {
    const orderFound = await Order.findById(req.params.orderId).populate(
      'products.product',
    );
    res.json({ order: orderFound });
  },
  createOrder: async (req, res) => {
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
    res.json({ order: populatedOrder });
  },
  updateOrder: async (req, res) => {
    const orderUpdated = await Order.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true },
    ).lean();
    res.json({
      order: {
        ...orderUpdated,
        products: orderUpdated.products.map((product) => ({
          productId: product.product,
          qty: product.qty,
        })),
      },
    });
  },
  deleteOrder: async (req, res) => {
    const deletedOrder = await Order.findByIdAndDelete(
      req.params.orderId,
    ).populate('products.product');
    res.json({ order: deletedOrder });
  },
};
