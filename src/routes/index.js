const auth = require('./auth');
const users = require('./users');
const products = require('./products');
const orders = require('./orders');

const root = (app, next) => {
  const pkg = app.get('pkg');
  app.get('/', (req, res) => res.json({ name: pkg.name, version: pkg.version }));

  // para el resto de rutas 404
  app.all('*', (req, resp, nextAll) => nextAll(404));
  return next();
};

// registra todas las rutas evita que lea una a una cada ruta, o que importe cada ruta una a una
const register = (app, routes, cb) => {
  if (!routes.length) {
    return cb();
  }

  routes[0](app, (err) => {
    if (err) {
      return cb(err);
    }
    return register(app, routes.slice(1), cb);
  });
};

module.exports = (app, next) => register(app, [auth, users, products, orders, root], next);
