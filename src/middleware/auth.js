const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (secret) => (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(" ");

  if (type.toLowerCase() !== "bearer") {
    return next();
  }

  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const user = await User.findById(decodedToken.id, { password: 0 });
    if (!user) {
      return res.status(404).send("NO user found");
    }
    res.json(user);
  });
};

module.exports.isAuthenticated = (req) =>
  // TODO: decidir por la informacion del request si la usuaria esta autenticada

  (module.exports.isAdmin = (req) =>
    // TODO: decidir por la informacion del request si la usuaria es admin
    true);

module.exports.requireAuth = (req, res, next) =>
  !module.exports.isAuthenticated(req) ? next(401) : next();

module.exports.requireAdmin = (req, resp, next) =>
  // eslint-disable-next-line no-nested-ternary
  !module.exports.isAuthenticated(req)
    ? next(401)
    : !module.exports.isAdmin(req)
    ? next(403)
    : next();
