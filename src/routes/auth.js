const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model');

const { secret } = config;

module.exports = (app, nextMain) => {
  /**
     * @name /auth
     * @description Crea token de autenticación.
     * @path {POST} /auth
     * @body {String} email Correo
     * @body {String} password Contraseña
     * @response {String} token Token a usar para los requests sucesivos
     * @code {200} si la autenticación es correcta
     * @code {401} si cabecera de autenticación no está presente ===>
     * @code {400} si no se proveen `email` o `password` o ninguno de los dos
     * @auth No requiere autenticación
     */
  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400); // datos mal enviado
    }

    const user = await User.findOne({ email });
    if (!user) return next(404); // no encontrado

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) return next(401); // no esta autorizado

    const token = jwt.sign({ uid: user._id }, secret); // genera un token

    resp.json({ token }); // devuelve el token
  });

  return nextMain();
};

// Aqui se autentica al usuario generando un TOKEN
