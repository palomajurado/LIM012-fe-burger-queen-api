import User from "../models/user";

module.exports = {
  getUsers: async (req, res, next) => {
    const users = await User.find();
    res.json(users);
  },
  getOneUser: async (req, res) => {
    const users = await User.findById(req.params.uid);
    res.json(users);
  },
  createUser: async (req, res, next) => {
    const newUser = new User(req.body);
    newUser.password = await newUser.encryptPassword(newUser.password);
    await newUser.save();
    res.json(newUser);
  },
  updateUser: async (req, res, next) => {
    const userUpdate = await User.findByIdAndUpdate(req.params.uid, req.body, {
      new: true,
    });
    res.json(userUpdate);
  },
  deleteUser: async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.uid);
    res.json(deletedUser);
  },
};
