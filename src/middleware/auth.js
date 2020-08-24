/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = (secret) => (req, res, next) => {
  // console.log('req', req.headers);
  const { authorization } = req.headers;

  if (!authorization) return next();

  const [type, token] = authorization.split(' ');

  // si dentro del token esta la palabra bearer continua
  if (type.toLowerCase() !== 'bearer') return next();
  // console.log(token, secret);

<<<<<<< HEAD
  // verifica si el token es un token valido
  jwt.verify(token, config.secret, async (err, decodedToken) => {
    if (err) return next(403);

    // TODO: Verificar identidad del usuario usando `decodeToken.uid` password 0 por que no quiere la contrasenia
    const user = await User.findById(decodedToken.uid, { password: 0 });
    if (!user) return res.status(404).send('No user found');

    // si existe usuario lo guarda en req.user = user;
    req.headers.user = user;
=======
  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      // console.log('este es el error');
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const user = await User.findById(decodedToken.uid);
    // if (!user) return res.status(404).send('No user found');
    if (!user) {
      // console.log('user no encontrado');
      return next(403);
    }
    req.user = user;
>>>>>>> 13cff79a920c19a6efc5e7e35832a5543ae43b8f
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
<<<<<<< HEAD
  // si el usuario es autenticado y si es administrador
  if (!module.exports.isAuthenticated(req)) next(401);
  if (
    !module.exports.isAdmin(req)
    && !(
      req.headers.user._id.toString() === req.params.uid
      || req.headers.user.email === req.params.uid
    )
  ) next(403);
  next();
=======
  // eslint-disable-next-line no-unused-expressions
  (!module.exports.isAuthenticated(req))
    ? next(401) : (!module.exports.isAdmin(req) && !(req.user._id.toString() === req.params.uid || req.user.email === req.params.uid))
      ? next(403)
      : next();
>>>>>>> 13cff79a920c19a6efc5e7e35832a5543ae43b8f
};
