const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { uidOrEmail, getPagination } = require('../utils/utils');
const { isAdmin } = require('../middleware/auth');

module.exports = {
  getUsers: async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}${req.path}`;

    const options = {
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
      select: '-password',
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

    res.json(responsePaginated.docs);
  },

  getOneUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);
      const user = await User.findOne(userObj).lean();

      res.json({
        _id: user._id,
        email: user.email,
        roles: user.roles,
      });
    } catch (error) {
      next(404);
    }
  },
  createUser: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) next(400);

      const userFound = await User.findOne({ email: req.body.email });

      if (userFound) next(403);

      // valida si la contrasenia es mayor o igual a seis caracteres
      if (req.body.password.length <= 3) next(400);

      req.body.password = bcrypt.hashSync(req.body.password, 10);

      const newUser = await User.create(req.body);

      res.json({
        _id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
      });
    } catch (err) {
      next(400);
    }
  },

  updateUser: async (req, res, next) => {
    const user = req.body;
    try {
      const obj = uidOrEmail(req.params.uid);
      const userFound = await User.findOne(obj);
      if (!userFound) next(404);
      if (!isAdmin(req) && user.roles) next(403);

      if (!user.email && !user.password) next(400);

      user.password = bcrypt.hashSync(user.password, 10);

      const userUpdate = await User.findOneAndUpdate(obj, user, { new: true });
      return res.json(userUpdate);
    } catch (error) {
      return next(404);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);

      const userFound = await User.findOne(userObj);
      if (!userFound) next(404);

      const deletedUser = await User.findOneAndDelete(userObj).lean();

      res.json({
        _id: deletedUser._id,
        email: deletedUser.email,
        roles: deletedUser.roles,
      });
    } catch (err) {
      next(404);
    }
  },
};
