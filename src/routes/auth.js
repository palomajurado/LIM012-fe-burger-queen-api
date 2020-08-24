const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400); // datos mal enviados o no envio alguno
    }

    const user = await User.findOne({ email });

    if (!user) return next(404); // no encontrado

    const passwordMatch = await user.comparePassword(password); // aqui uso acceso de contrasenia el almacenamiento es el password guardado en la base de datos

    if (!passwordMatch) return next(401); // no esta autorizado

    const token = jwt.sign({ uid: user._id }, secret); // genera un token

    resp.json({ resp: { token } }); // devuelve el token
  });

  return nextMain();
};

// Aqui se autentica al usuario generando un TOKEN
