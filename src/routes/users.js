import User from '../models/user.model';

const bcrypt = require('bcrypt');
const { requireAuth, requireAdmin, requireAdminOrUser } = require('../middleware/auth');
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controller/users.controller');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }
  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    roles: { admin: true },
  };

  const user = await User.findOne({ email: adminEmail });
  if (!user) {
    // TODO: crear usuaria admin
    const newAdminUser = new User(adminUser);
    await newAdminUser.save();
  }
  next();
};

module.exports = (app, next) => {
  app.delete('/users/:uid', requireAdminOrUser, deleteUser);

  app.get('/users', requireAdmin, getUsers);

  app.get('/users/:uid', requireAdminOrUser, getOneUser);

  app.post('/users', requireAdmin, createUser);

  app.put('/users/:uid', requireAdminOrUser, updateUser);

  initAdminUser(app, next);
};
