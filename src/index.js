const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('../package.json');
const cors = require('cors')

const { port, dbUrl, secret } = config;
const app = express();

console.log('aqui la URL de la BD:', dbUrl);
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then((db) => console.log('db connected!', db.connection.host))
  .catch((err) => console.error(err));

// TODO: Conexión a la BD en mogodb

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(cors())
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // se convierte a objeto json el req.body y lo podemos manipular en codigo
app.use(authMiddleware(secret));

// Registrar rutas
// lee todas las rutas creadas en la carpeta routes y luego ejecuta el app.listen
routes(app, (err) => {
  if (err) {
    throw err;
  }
  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
