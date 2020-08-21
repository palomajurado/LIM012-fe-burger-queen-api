const mongoose = require('mongoose');

const {
  getOrders,
  getOneOrder,
  createOrder,
  deleteOrder,
  updateOrder,
} = require('../orders.controller');

const { createUser } = require('../users.controller');
const { getProducts } = require('../products.controller');

const { resp, next } = require('./mock-express');
const { dbUrl } = require('../../config');

const adminUser = {
  email: 'admin@localhost.test',
  password: '1234567',
  roles: {
    admin: true,
  },
};

const req = {
  get: (name) => name,
  query: {
    page: 1,
    limit: 3,
  },
};
describe('Orders', () => {
  beforeAll((done) => {
    // conexion a la base datos
    console.log(`BD is connected to ${dbUrl}`);
    mongoose
      .connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .catch((err) => console.error(err));

    mongoose.connection.on('connected', async () => {
      const req = {
        body: adminUser,
      };
      await createUser(req, resp, next);
      await createUser(
        { body: { ...adminUser, email: 'admin2@localhost.test' } },
        resp,
        next,
      );
      done();
    });
  });

  it('should add a new order to the collection', async () => {
    const products = await getProducts(req, resp, next);
    const newOrder = {
      body: {
        userId: '5d4916541d4f9a3b2dcac66d',
        client: 'Maria',
        products: [
          { qty: 5, productId: products[0]._id },
          { qty: 3, productId: products[1]._id },
        ],
      },
    };
    const result = await createOrder(newOrder, resp, next);
    expect(result.userId).toBe('5d4916541d4f9a3b2dcac66d');
    expect(result.products.length).toBe(2);
    expect(result.products[0].product._id).toStrictEqual(products[0]._id);
    expect(result.products[1].product._id).toStrictEqual(products[1]._id);
    expect(result.status).toStrictEqual('pending');
  });
  it('should not add a new order when don\'t set products', async () => {
    const newOrder = {
      body: {
        userId: '5d4916541d4f9a3b2dcac66d',
        client: 'Maria',
        products: [],
      },
    };
    const result = await createOrder(newOrder, resp, next);
    expect(result).toBe(400);
  });

  it('should get an array of orders', async () => {
    const products = await getProducts(req, resp, next);
    const newOrder = {
      body: {
        userId: '5r6916541d4f9a3b2dcacds3',
        client: 'Julian',
        products: [
          { qty: 1, productId: products[2]._id },
          { qty: 2, productId: products[0]._id },
        ],
      },
    };
    await createOrder(newOrder, resp, next);
    const result = await getOrders(req, resp, next);
    expect(result[0].userId).toBe('5d4916541d4f9a3b2dcac66d');
    expect(result[1].userId).toBe('5r6916541d4f9a3b2dcacds3');
    expect(result[0].products[0].product.name).toBe('product1');
    expect(result[1].products[0].product.name).toBe('burger chicken');
  });
  it('should get an order whith a specific _id', async () => {
    const orders = await getOrders(req, resp, next);
    const id = orders[0]._id;
    const reqOrder = { params: { orderId: id } };
    const result = await getOneOrder(reqOrder, resp, next);
    expect(result.userId).toBe('5d4916541d4f9a3b2dcac66d');
    expect(result.products[0].product.name).toBe('product1');
  });
  it('should return a error 404 when an order with a specific _id doesn\'t exit!', async () => {
    const reqOrder = { params: { orderId: '2342342sf23' } };
    const result = await getOneOrder(reqOrder, resp, next);
    expect(result).toBe(404);
  });
  it('should not update an order when there isn\'t nothing to update', async () => {
    const newOrder = {
      params: {
        orderId: '',
      },
      body: {
      },
    };
    const orders = await getOrders(req, resp, next);
    newOrder.params.orderId = orders[0]._id;
    const result = await updateOrder(newOrder, resp, next);
    expect(result).toBe(400);
  });
  it('should  not update an order with a status that doesn\'t exit!', async () => {
    const newOrder = {
      params: {
        orderId: '',
      },
      body: {
        userId: '5r6916541d4f9a3b2dcacds3',
        client: 'Julian',
        products: [
          { qty: 1, productId: '78979hjgjg8899jhh' },
          { qty: 2, productId: '79879jhkhkh789979' },
        ],
        status: 'cancel',
      },
    };
    const orders = await getOrders(req, resp, next);
    newOrder.params.orderId = orders[0]._id;
    const result = await updateOrder(newOrder, resp, next);
    expect(result).toBe(400);
  });
  it('should  delete an order with a specific _id', async () => {
    const orders = await getOrders(req, resp, next);
    const deletedOrder = {
      params: { orderId: orders[0]._id },
      body: {
        status: 'delivered',
        userId: '5r6916541d4f9a3b2dcacds3',
        client: 'Julian',
        products: [],
      },
    };
    const result = await deleteOrder(deletedOrder, resp, next);
    expect(result._id).toStrictEqual(orders[0]._id);
  });
});
