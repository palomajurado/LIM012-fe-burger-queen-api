/* eslint-disable no-unused-vars */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const {
  getUsers, getOneUser, createUser, updateUser, deleteUser,
} = require('../users.controller');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
let port;
beforeEach(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
  mongoServer = new MongoMemoryServer();
  port = await mongoServer.getPort();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, (err) => {
    if (err) console.error(err);
  });
});

const requestOfPostUsers = {
  headers: {
    authorization: '',
  },
  body: {
    _id: '5d4916541d4f9a3b2dcac66d',
    email: 'marjorie@labo.la',
    password: '123456',
  },
};

const responseObjectOfUser = {
  roles: { admin: false },
  _id: '5d4916541d4f9a3b2dcac66d', // 5d4916541d4f9a3b2dcac66d,
  email: 'marjorie@labo.la',
};
const emptyRequest = {
  headers: {
    authorization: '',
  },
  body: {
    email: '',
    password: '1234567',
  },
};
const emptyRequest2 = {
  headers: {
    authorization: '',
  },
  body: {
    email: '',
    password: '',
  },
};
const responseObjectOfNewAdmin = {
  roles: { admin: true },
  _id: '5d4916541d4f9a3b2dcac66d', // 5d4916541d4f9a3b2dcac66d,
  email: 'marjorie@labo.la',
};

const requestOfPostUsersDuplicated = {
  headers: {
    authorization: '',
  },
  body: {
    email: 'marjorie@labo.la',
    password: 'contraseña',
  },
};

// ----------------------------

const requestOfGetUsers = {
  headers: {
    authorization: '',
  },
  query: {
    limit: 10,
    page: 1,
  },
  protocol: 'http',
  get: jest.fn((res) => `localhost:${port}`),
  path: '/users',
};
const requestOfPostUsers2 = {
  headers: {
    authorization: '',
  },
  body: {
    email: 'mayte@labo.la',
    password: 'samaniego',
  },
};

const responseOfGetUsers = [];

describe('GET/ users', () => {
  const res = {
    send: jest.fn((json) => json),
    set: jest.fn((json) => json),
  };

  const next = jest.fn((json) => json);
});

// estos tenemos que desarrollarlos nosotras
