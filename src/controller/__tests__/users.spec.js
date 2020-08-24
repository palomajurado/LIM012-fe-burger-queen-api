// npx jest -t getUsers
const mongoose = require('mongoose');
const User = require('../../models/user.model');

const {
  getUsers,
  getOneUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../users.controller');

const { resp, next } = require('./mock-express');
const { dbUrl } = require('../../config');

// DATA
const userAddedReq = {
  body: {
    email: 'test@localhost.test',
    password: 'changeme',
    roles: {
      admin: false,
    },
  },
};

const failedReq = {
  body: {
    email: 'error@localhost.test',
  },
  params: {
    uid: 'error@localhost.test',
  },
};

const userData = {
  email: 'admin@localhost.test',
  password: '1234567',
  roles: {
    admin: true,
  },
};

describe('Users', () => {
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
        body: userData,
      };
      await createUser(req, resp, next);
      await createUser(
        { body: { ...userData, email: 'admin2@localhost.test' } },
        resp,
        next,
      );
      done();
    });
  });

  it('should add a user to the collection', async () => {
    const result = await createUser(userAddedReq, resp, next);
    expect(result.email).toBe('test@localhost.test');
    expect(result.password).toBeUndefined();
    expect(result.roles.admin).toBeFalsy();
  });

  it('should not add a user that already exists with the email', async () => {
    const result = await createUser(userAddedReq, resp, next);
    expect(result).toBe(403);
  });

  it('should not add a user to the collection when password is missing', async () => {
    const result = await createUser(failedReq, resp, next);
    expect(result).toBe(400);
  });

  it('should not add a user to the collection when the email is not valid', async () => {
    const req = {
      body: {
        email: 'localhost',
        password: '123456',
      },
    };
    const result = await createUser(req, resp, next);
    expect(result).toBe(400);
  });

  it('should not add a user to the collection when the password is less than 6 characters', async () => {
    const req = {
      body: {
        email: 'localhost@localhost.test',
        password: '123',
      },
    };
    const result = await createUser(req, resp, next);
    expect(result).toBe(400);
  });

  it('should get users collection', async () => {
    const req = {
      get: (name) => name,
      query: {
        page: 1,
        limit: 1,
      },
    };

    const result = await getUsers(req, resp, next);

    delete result[0]._doc._id;
    delete result[0]._doc.password;
    delete userData.password;

    expect(result[0]._doc).toEqual(userData);
  });

  it('should get user requested with email: admin@localhost.test', async () => {
    const req = {
      params: {
        uid: 'admin@localhost.test',
      },
    };
    const result = await getOneUser(req, resp, next);
    delete result._id;
    expect(result).toEqual(userData);
  });

  it('should not get user requested with email: unknown@localhost.test and return 404', async () => {
    const req = {
      params: {
        uid: 'unknown@localhost.test',
      },
    };
    const result = await getOneUser(req, resp, next);
    expect(result).toBe(404);
  });

  it('should not edit the user password when the new value is weak', async () => {
    delete userAddedReq.body.password;
    const req = {
      body: {
        email: 'admin@localhost.test',
        password: 'wow',
      },
      params: { uid: 'admin@localhost.test' },
      headers: {
        authorization: '',
      },
      user: userAddedReq.body,
    };
    const result = await updateUser(req, resp, next);
    expect(result).toBe(400);
  });

  it('should not edit the user email when is not a valid one', async () => {
    const req = {
      body: {
        email: 'wrongFormatLocalhost',
      },
      params: { uid: 'test@localhost.test' },
      headers: {
        authorization: '',
      },
      user: userAddedReq.body,
    };
    const result = await updateUser(req, resp, next);
    expect(result).toBe(400);
  });

  it('should not be able to edit roles field when the user is not an admin', async () => {
    const req = {
      body: {
        password: 'changeme',
        email: 'test@localhost.test',
        roles: {
          admin: false,
        },
      },
      params: { uid: 'test@localhost.test' },
      headers: {
        authorization: '',
      },
      user: {
        roles: {
          admin: false,
        },
      },
    };
    const result = await updateUser(req, resp, next);
    expect(result).toBe(403);
  });

  it('should not be able to edit a user when it doesnt exit', async () => {
    const req = {
      body: {},
      params: { uid: 'test@localhost.test' },
      headers: {
        authorization: '',
      },
      user: {},
    };
    const result = await updateUser(req, resp, next);
    expect(result).toBe(404);
  });

  it('should edit the user email', async () => {
    const req = {
      body: {
        email: 'test@localhost.test',
        password: '1234567',
      },
      params: { uid: 'test@localhost.test' },
      headers: {
        authorization: '',
      },
      user: userAddedReq.body,
    };
    const result = await updateUser(req, resp, next);
    expect(result.email).toBe('test@localhost.test');
  });

  it('should edit the user roles', async () => {
    const req = {
      body: {
        email: 'newtest@localhost.test',
        password: 'newPassword',
        roles: {
          admin: false,
        },
      },
      params: { uid: 'newtest@localhost.test' },
      headers: {
        authorization: '',
      },
      user: {
        email: 'newtest@localhost.test',
        roles: {
          admin: true,
        },
      },
    };
    await createUser(req, resp, next);
    const result = await updateUser(req, resp, next);
    expect(result.roles.admin).toBeFalsy();
  });

  it('should delete user requested with email: admin2@localhost', async () => {
    const req = {
      params: { uid: 'admin2@localhost.test' },
    };
    const result = await deleteUser(req, resp, next);
    const userExists = await User.findOne({ email: req.params.uid });
    delete result._id;
    expect(result).toEqual({ ...userData, email: 'admin2@localhost.test' });
    expect(userExists).toBeNull();
  });

  it('should not update or delete the user when is not found', async () => {
    const result1 = await deleteUser(failedReq, resp, next);
    const result2 = await updateUser(
      {
        body: { email: 'notfound@localhost.test', password: '1234567' },
        params: { uid: 'notfound@localhost.test' },
      },
      resp,
      next,
    );
    expect(result1).toBe(404);
    expect(result2).toBe(404);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
