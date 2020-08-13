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

    return res.json({
      users: responsePaginated.docs,
    });
  },

  getOneUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);
      const user = await User.findOne(userObj).lean();

      return res.json({
        user: {
          _id: user._id,
          email: user.email,
          roles: user.roles,
        },
      });
    } catch (error) {
      return next(404);
    }
  },

  createUser: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) return next(400);

      // valida si ese correo ya existe
      const userFound = await User.findOne({ email: req.body.email });
      if (userFound) {
        return next(403);
      }

      // valida si la contrasenia es mayor o igual a seis caracteres
      if (req.body.password.length <= 6) {
        return next(400);
      }

      req.body.password = bcrypt.hashSync(req.body.password, 10);

      const newUser = await User.create(req.body);

      return res.json({
        user: {
          _id: newUser._id,
          email: newUser.email,
          roles: newUser.roles,
        },
      });
    } catch (err) {
      return next(400);
    }
  },

  updateUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password) return next(400);
    const obj = uidOrEmail(req.params.uid);

    const userFound = await User.findOne(obj);
    if (!userFound) return next(404);

    if (!userFound.roles.admin) return next(403);

    // valida si la contrasenia es mayor o igual a seis caracteres
    if (req.body.password.length <= 6) {
      return next(400);
    }

    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);

    const userUpdate = await User.findOneAndUpdate(obj, user, {
      new: true,
    });

    return res.json({ user: userUpdate });
  },
  deleteUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);

      const userFound = await User.findOne(userObj);
      if (!userFound) return next(404);

      const deletedUser = await User.findOneAndDelete(userObj).lean();

      return res.json({
        user: {
          _id: deletedUser._id,
          email: deletedUser.email,
          roles: deletedUser.roles,
        },
      });
    } catch (err) {
      return next(404);
    }
  },
};
