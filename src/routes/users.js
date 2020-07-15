
import User from "../models/user";
const bcrypt = require("bcrypt");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/users");

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get("config");
  if (!adminEmail || !adminPassword) {
    return next();
  }
  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    roles: { admin: true },
  };

  const newAdminUser = new User(adminUser);
  await newAdminUser.save();
  // TODO: crear usuaria admin
  next();
};

module.exports = (app, next) => {
  app.get("/users", requireAdmin, getUsers);

  app.get("/users/:uid", requireAuth, getOneUser);

  app.post("/users", requireAdmin, createUser);

  app.put("/users/:uid", requireAuth, updateUser);

  app.delete("/users/:uid", requireAuth, deleteUser);

  initAdminUser(app, next);
};
