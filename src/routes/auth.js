/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const jwt = require("jsonwebtoken");
const config = require("../config");

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post("/auth", (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    // TODO: autenticar a la usuarix
    next();
  });

  return nextMain();
};
