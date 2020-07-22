const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { getPagination } = require('../utils/utils');
const { uidOrEmail } = require('../utils/utils');

module.exports = {
  getUsers: async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}${req.path}`;
    const options = {
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
    };
    const responsePaginated = await User.paginate({}, options);
    res.set(
      'link',
      getPagination(
        url,
        options.page,
        options.limit,
        responsePaginated.totalPages,
      ),
    );

    res.json({
      users: responsePaginated.docs,
    });
  },
  getOneUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);
      const user = await User.findOne(userObj);
      res.json({
        user: {
          _id: user._id,
          email: user.email,
          roles: user.roles,
        },
      });
    } catch (error) {
      next(404);
    }
  },
  createUser: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) next(400);
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      const newUser = await User.create(req.body);
      res.json({
        user: {
          _id: newUser._id,
          email: newUser.email,
          roles: newUser.roles,
        },
      });
    } catch (err) {
      next(403);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) next(400);
      if (req.body.roles) next(403);
      const obj = uidOrEmail(req.params.uid);
      const user = req.body;
      user.password = bcrypt.hashSync(user.password, 10);
      const userUpdate = await User.findOneAndUpdate(obj, user, {
        new: true,
      });
      res.json({ user: userUpdate });
    } catch (err) {
      next(404);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);
      const deletedUser = await User.findOneAndDelete(userObj);
      res.json({
        user: {
          _id: deletedUser._id,
          email: deletedUser.email,
          roles: deletedUser.roles,
        },
      });
    } catch (err) {
      next(404);
    }
  },
};
