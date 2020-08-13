/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = (secret) => (req, res, next) => {
  // console.log('req', req.headers);
  const { authorization } = req.headers;

  if (!authorization) return next();

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') return next();
  // console.log(token, secret);

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      console.log('este es el error');
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const user = await User.findById(decodedToken.uid);
    // if (!user) return res.status(404).send('No user found');
    if (!user) {
      console.log('user no encontrado');
      return next(403);
    }
    req.user = user;
    next();
  });
};

// TODO: decidir por la informacion del request si la usuaria esta autenticada
// module.exports.isAuthenticated = (req) => !!req.headers.authorization;
module.exports.isAuthenticated = (req) => (!!req.user);

// TODO: decidir por la informacion del request si la usuaria es admin
module.exports.isAdmin = (req) => !!req.user.roles.admin;
// module.exports.isAdmin = (req) => !!req.headers.user.roles.admin;

module.exports.requireAuth = (req, res, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line implicit-arrow-linebreak
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);

module.exports.requireAdminOrUser = (req, res, next) => {
  // eslint-disable-next-line no-unused-expressions
  (!module.exports.isAuthenticated(req))
    ? next(401) : (!module.exports.isAdmin(req) && !(req.user._id.toString() === req.params.uid || req.user.email === req.params.uid))
      ? next(403)
      : next();
};
