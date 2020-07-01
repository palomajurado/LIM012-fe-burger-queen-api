/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const { requireAuth } = require("../middleware/auth");

module.exports = (app, nextMain) => {
  app.get("/orders", requireAuth, (req, res, next) => {});

  app.get("/orders/:orderId", requireAuth, (req, resp, next) => {});

  app.post("/orders", requireAuth, (req, res, next) => {});

  app.put("/orders/:orderId", requireAuth, (req, res, next) => {});

  app.delete("/orders/:orderId", requireAuth, (req, res, next) => {});

  nextMain();
};
