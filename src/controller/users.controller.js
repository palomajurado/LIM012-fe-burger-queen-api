import User from '../models/user.model';
import { uidOrEmail } from './utils';
import { isAdmin } from '../middleware/auth';

const bcrypt = require('bcrypt');

module.exports = {
  getUsers: async (req, res) => {
    const users = await User.find();
    res.json(
      users.map((user) => ({
        _id: user._id,
        email: user.email,
        roles: user.roles,
      })),
    );
  },
  getOneUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);
      const user = await User.findOne(userObj);
      res.json({
        _id: user._id,
        email: user.email,
        roles: user.roles,
      });
    } catch (error) {
      next(404);
    }
  },
  createUser: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) next(400);
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      const newUser = await User.create(req.body);
      res.json({
        _id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
      });
    } catch (err) {
      console.error(err);
      next(403);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) next(400);
      if (req.body.roles && !isAdmin(req)) next(403);
      const obj = uidOrEmail(req.params.uid);
      const user = req.body;
      user.password = bcrypt.hashSync(user.password, 10);
      const userUpdate = await User.findOneAndUpdate(obj, user, {
        new: true,
      });
      res.json(userUpdate);
    } catch (err) {
      next(404);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);
      const deletedUser = await User.findOneAndDelete(userObj);
      res.json({
        _id: deletedUser._id,
        email: deletedUser.email,
        roles: deletedUser.roles,
      });
    } catch (err) {
      next(404);
    }
  },
};
