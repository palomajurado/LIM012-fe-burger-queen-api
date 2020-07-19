import User from "../models/user";
import { getPagination } from "../utils/utils";

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
    const user = await User.findById(req.params.uid);
    if (!user) next(404);

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        roles: user.roles,
      },
    });
  },
  createUser: async (req, res, next) => {
    const newUser = new User(req.body);
    const user = User.find({ email: req.body.email });
    if (user) next(403);

    newUser.password = await newUser.encryptPassword(newUser.password);
    const userSaved = await newUser.save();
    delete userSaved._doc.password;
    res.json({ user: userSaved });
  },
  updateUser: async (req, res, next) => {
    const userUpdate = await User.findByIdAndUpdate(req.params.uid, req.body, {
      new: true,
    });
    delete userUpdate._doc.password;
    res.json({ user: userUpdate });
  },
  deleteUser: async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.uid);
    res.json({
      user: {
        _id: deletedUser._id,
        email: deletedUser.email,
        roles: deletedUser.roles,
      },
    });
  },
};
