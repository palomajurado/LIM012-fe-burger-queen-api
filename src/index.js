/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config.js");
const authMiddleware = require("./middleware/auth");
const errorHandler = require("./middleware/error");
const routes = require("./routes");
const pkg = require("../package.json");

const { port, dbUrl, secret } = config;
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => console.log(db.connection.host))
  .catch((err) => console.error(err));

const app = express();

// TODO: Conexión a la BD en mogodb

app.set("config", config);
app.set("pkg", pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});