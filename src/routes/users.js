/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const bcrypt = require("bcrypt");

const { requireAuth, requireAdmin } = require("../middleware/auth");

const { getUsers } = require("../controller/users");

const initAdminUser = (app, next) => {
  const { adminEmail, adminPassword } = app.get("config");
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    roles: { admin: true },
  };

  // TODO: crear usuaria admin
  next();
};

module.exports = (app, next) => {
  app.get("/users", requireAdmin, getUsers);

  app.get("/users/:uid", requireAuth, (req, resp) => {});

  app.post("/users", requireAdmin, (req, resp, next) => {});

  app.put("/users/:uid", requireAuth, (req, resp, next) => {});

  app.delete("/users/:uid", requireAuth, (req, resp, next) => {});

  initAdminUser(app, next);
};
