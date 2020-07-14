/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable padded-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import User from "../models/user";

const bcrypt = require("bcrypt");
// const { User } = require('../models/user');

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

  app.get("/users/:uid", requireAuth, async (req, res) => {
    const users = await User.findById(req.params.uid);
    res.json(users);
  });

  app.post("/users", requireAdmin, async (req, res, next) => {
    const newUser = await User.create(req.body);
    res.json(newUser);
  });

  app.put("/users/:uid", requireAuth, async (req, res, next) => {
    const userUpdate = await User.findByIdAndUpdate(req.params.uid, req.body, {
      new: true,
    });
    res.json(userUpdate);
  });

  app.delete("/users/:uid", requireAuth, async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.uid);
    res.json(deletedUser);
  });

  initAdminUser(app, next);
};
