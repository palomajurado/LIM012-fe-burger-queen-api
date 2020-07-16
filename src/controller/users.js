import User from '../models/user';

module.exports = {
  deleteUser: async (req, res, next) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.uid);
      res.json({
        _id: deletedUser._id,
        email: deletedUser.email,
        roles: deletedUser.roles,
      });
    } catch (error) {
      next(404);
    }
  },
  getUsers: async (req, res) => {
    const users = await User.find();
    res.json(users.map((user) => ({
      _id: user._id,
      email: user.email,
      roles: user.roles,
    })));
  },
  getOneUser: async (req, res, next) => {
    const user = await User.findById(req.params.uid);
    if (!user) next(404);
    res.json({
      _id: user._id,
      email: user.email,
      roles: user.roles,
    });
  },
  createUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password) next(400);
    const existingUse = await User.findOne({ email: req.body.email });
    if (existingUse) next(403);
    const newUser = await User.create(req.body);
    res.json({
      _id: newUser._id,
      email: newUser.email,
      roles: newUser.roles,
    });
  },
  updateUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password) next(400);

    const userUpdate = await User.findByIdAndUpdate(req.params.uid, req.body, {
      new: true,
    });
    res.json(userUpdate);
  },
};
