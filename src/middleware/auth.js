import User from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config";

module.exports = (secret) => (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return next();

  const [type, token] = authorization.split(" ");

  if (type.toLowerCase() !== "bearer") return next();

  jwt.verify(token, config.secret, async (err, decodedToken) => {
    if (err) return next(403);
    console.log(decodedToken);

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const user = await User.findById(decodedToken.uid, { password: 0 });
    if (!user) return res.status(404).send("No user found");
    req.user = user;
    next();
  });
};

// TODO: decidir por la informacion del request si la usuaria esta autenticada
module.exports.isAuthenticated = (req) => req.headers.authorization;

// TODO: decidir por la informacion del request si la usuaria es admin
module.exports.isAdmin = (req) => req.user.roles.admin;

module.exports.requireAuth = (req, res, next) =>
  !module.exports.isAuthenticated(req) ? next(401) : next();

module.exports.requireAdmin = (req, resp, next) =>
  // eslint-disable-next-line no-nested-ternary
  !module.exports.isAuthenticated(req)
    ? next(401)
    : !module.exports.isAdmin(req)
    ? next(403)
    : next();
