const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const {
  uidOrEmail, getPagination, isAWeakPassword, isAValidEmail,
} = require('../utils/utils');
const { isAdmin } = require('../middleware/auth');

// json formato de intercambio de datos otros xml, yml
// cors es un concepto para evitar la conexion de cualquier servidor al mio a menos que se lo permita

module.exports = {
  // se le conoce como un request handler DECIDE QUE HACER CON LA PETICION
  getUsers: async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}${req.path}`;

    const options = {
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
      select: '-password',
    };

    // {} esto es para filtrar segun lo que se pida
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
    // al final el res.json se le devuelve al cliente

    return res.json(responsePaginated.docs);
  },

  getOneUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);
      const user = await User.findOne(userObj).lean();

      return res.json({
        _id: user._id,
        email: user.email,
        roles: user.roles,
      });
    } catch (error) {
      return next(404);
    }
  },
  createUser: async (req, res, next) => {
    try {
      const user = req.body;
      if (!user || !user.email || !user.password) return next(400);

      const userFound = await User.findOne({ email: user.email });
      if (userFound) return next(403);

      // valida si la contrasenia es mayor o igual a tres caracteres
      if (user.password && isAWeakPassword(user.password)) return next(400);
      if (user.email && !isAValidEmail(user.email)) return next(400);

      user.password = bcrypt.hashSync(user.password, 10);

      const newUser = await User.create(user);
      return res.json({
        _id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
      });
    } catch (err) {
      return next(404);
    }
  },

  updateUser: async (req, res, next) => {
    const user = req.body;
    try {
      const obj = uidOrEmail(req.params.uid);
      const userFound = await User.findOne(obj);
      if (!userFound) return next(404);
      if (!isAdmin(req) && user.roles) return next(403);

      if (!user.email && !user.password) return next(400);
      if (user.password && isAWeakPassword(user.password)) return next(400);
      if (user.email && !isAValidEmail(user.email)) return next(400);

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

      // const userFound = await User.findOne(userObj);
      // if (!userFound) return next(404);

      const deletedUser = await User.findOneAndDelete(userObj).lean();

      return res.json({
        _id: deletedUser._id,
        email: deletedUser.email,
        roles: deletedUser.roles,
      });
    } catch (err) {
      return next(404);
    }
  },
};
