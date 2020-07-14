import User from "../models/user";

module.exports = {
  getUsers: async (req, res, next) => {
    const users = await User.find();
    res.json(users);
  },
};
