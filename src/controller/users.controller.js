import User from "../models/user.model";
import { getPagination } from "../utils/utils";
import { uidOrEmail } from "../utils/utils";
import { isAdmin } from "../middleware/auth";
const bcrypt = require("bcrypt");

module.exports = {
  getUsers: async (req, res) => {
    const url = `${req.protocol}://${req.get("host")}${req.path}`;
    const options = {
      limit: parseInt(req.query.limit) || 10,
      page: parseInt(req.query.page) || 1,
      select: "-password",
    };
    const responsePaginated = await User.paginate({}, options);
    res.set(
      "link",
      getPagination(
        url,
        options.page,
        options.limit,
        responsePaginated.totalPages
      )
    );
    res.json({ users: responsePaginated.docs });
  },
  getOneUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);

      const user = await User.findById(userObj);

      // if user does not exists
      if (!user) next(404);

      res.json({
        user: {
          _id: user._id,
          email: user.email,
          roles: user.roles,
        },
      });
    } catch (error) {
      next(500);
    }
  },
  createUser: async (req, res, next) => {
    // if email and password does not exists
    if (!req.body.email || !req.body.password) next(400);

    // verifying if user exists
    const user = User.find({ email: req.body.email });
    if (user) next(403);

    // creating a new user
    const newUser = new User(req.body);

    // encrypt password
    newUser.password = await newUser.encryptPassword(newUser.password);

    // saving the new user in Mongodb
    const userSaved = await newUser.save();

    // deleting password of the new user for the client
    delete userSaved._doc.password;

    res.json({ user: userSaved });
  },
  updateUser: async (req, res, next) => {
    // must update both plus role if the admin wants to give true the role
    // of some user
    if (!req.body.email || !req.body.password) next(400);

    if (req.body.roles && !isAdmin(req)) next(403);
    const obj = uidOrEmail(req.params.uid);
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    const userUpdate = await User.findOneAndUpdate(obj, user, {
      new: true,
    });

    delete userUpdate._doc.password;
    res.json(userUpdate);
  },

  deleteUser: async (req, res, next) => {
    try {
      const userObj = uidOrEmail(req.params.uid);
      const deletedUser = await User.findByIdAndDelete(userObj);
      res.json({
        user: {
          _id: deletedUser._id,
          email: deletedUser.email,
          roles: deletedUser.roles,
        },
      });
    } catch (err) {
      next(404);
    }
  },
};
