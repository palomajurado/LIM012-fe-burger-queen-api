import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  roles: { admin: { type: Boolean, default: false } },
});

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
