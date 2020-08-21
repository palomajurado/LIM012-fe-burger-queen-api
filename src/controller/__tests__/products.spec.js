const mongoose = require('mongoose');

const {
  getProducts,
  getOneProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} = require('../products.controller');

const { createUser } = require('../users.controller');

const { resp, next } = require('./mock-express');
const { dbUrl } = require('../../config');

const adminUser = {
  email: 'admin@localhost.test',
  password: '1234567',
  roles: {
    admin: true,
  },
};

describe('Products', () => {
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

  it('should add a new product to the collection', async () => {
    const newProduct = {
      body: {
        name: 'product1',
        price: 1,
        type: 'hamburguesa',
      },
    };
    const result = await createProduct(newProduct, resp, next);
    expect(result.name).toBe('product1');
  });
  it('should not add a new product when don\'t set price or name abd return a error 400', async () => {
    const newProduct = {
      body: {
        name: 'product1',
        type: 'hamburguesa',
      },
    };
    const result = await createProduct(newProduct, resp, next);
    expect(result).toBe(400);
  });
  it('should not add a new product when price is not a number ', async () => {
    const newProduct = {
      body: {
        name: 'product1',
        price: 'price',
        type: 'hamburguesa',
      },
    };
    const result = await createProduct(newProduct, resp, next);
    expect(result).toBe(404);
  });
  it('should get an array of products', async () => {
    const req = {
      get: (name) => name,
      query: {
        page: 1,
        limit: 3,
      },
    };
    const newProduct1 = {
      body: {
        name: 'burger meet',
        price: 10,
        type: 'hamburguesa',
      },
    };
    const newProduct2 = {
      body: {
        name: 'burger chicken',
        price: 14,
        type: 'hamburguesa',
      },
    };
    await createProduct(newProduct1, resp, next);
    await createProduct(newProduct2, resp, next);
    const result = await getProducts(req, resp, next);
    // console.log(result);
    expect(result.length).toBe(3);
    expect(result[0].name).toBe('product1');
    expect(result[1].name).toBe('burger meet');
    expect(result[2].name).toBe('burger chicken');
  });
  it('should return a error 404 when a product with _id:5f3b15ccbab891042d19f1c1 doesn\'t exit!', async () => {
    const req = {
      params: {
        uid: '5f3b15ccbab891042d19f1c1',
      },
    };
    const result = await getOneProduct(req, resp, next);
    expect(result).toBe(404);
  });
  it('should return a error 404 when a product with _id:5f3b15ccbab891042d19f1c1 doesn\'t exit!', async () => {
    const req = {
      params: {
        uid: '5f3b15ccbab891042d19f1c1',
      },
    };
    const result = await getOneProduct(req, resp, next);
    expect(result).toBe(404);
  });
  it('should get a product by _id!', async () => {
    const newProduct1 = {
      body: {
        name: 'inca kola',
        price: 5,
        type: 'sodas',
      },
    };
    const req = {
      params: { productId: '' },
    };
    const product = await createProduct(newProduct1, resp, next);
    req.params.productId = product._id;
    const result = await getOneProduct(req, resp, next);
    expect(result.name).toBe('inca kola');
    expect(result.price).toBe(5);
  });

  it('should edit the price of a product by _id!', async () => {
    const newProduct = {
      body: {
        name: 'papaya juice',
        price: 7,
        type: 'sodas',
      },
    };

    const editProduct = {
      params: { productId: '' },
      body: {
        name: 'orange juice',
        price: 5,
        type: 'juices',
      },
    };
    const product = await createProduct(newProduct, resp, next);
    editProduct.params.productId = product._id;
    const result = await updateProduct(editProduct, resp, next);
    expect(result.name).toBe('orange juice');
    expect(result.price).toBe(5);
    expect(result.type).toBe('juices');
  });
  it('should return error 400 when there isn\'t nothing to update', async () => {
    const newProduct = {
      body: {
        name: 'papaya juice',
        price: 7,
        type: 'sodas',
      },
    };

    const editProduct = {
      params: { productId: '' },
      body: {},
    };
    const product = await createProduct(newProduct, resp, next);
    editProduct.params.productId = product._id;
    const result = await updateProduct(editProduct, resp, next);
    expect(result).toBe(400);
  });
  it('should return error 400 when the price isn\'t set', async () => {
    const newProduct = {
      body: {
        name: 'papaya juice',
        price: 7,
        type: 'sodas',
      },
    };

    const editProduct = {
      params: { productId: '' },
      body: {
        name: 'orange juice',
        price: '',
      },
    };
    const product = await createProduct(newProduct, resp, next);
    editProduct.params.productId = product._id;
    const result = await updateProduct(editProduct, resp, next);
    expect(result).toBe(400);
  });
  it('should delete a product with _id', async () => {
    const newProduct = {
      body: {
        name: 'coffee',
        price: 5,
        type: 'hot drinks',
      },
    };

    const deletedProduct = {
      params: { productId: '' },
    };
    const product = await createProduct(newProduct, resp, next);
    deletedProduct.params.productId = product._id;
    const result = await deleteProduct(deletedProduct, resp, next);
    expect(result.name).toBe('coffee');
    expect(result.type).toBe('hot drinks');
  });
  it('should return a error 404 when a product isn\'t found ', async () => {
    const deletedProduct = {
      params: { productId: '88686998070707' },
    };
    const result = await deleteProduct(deletedProduct, resp, next);
    expect(result).toBe(404);
  });
});
