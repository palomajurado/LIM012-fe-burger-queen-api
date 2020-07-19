import mongoose from "mongoose";
const mongoosePaginate = require("mongoose-paginate-v2");
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    email: { type: String, require: true, unique: true, lowercase: true },
    password: { type: String, require: true },
    roles: { admin: { type: Boolean, default: false } },
  },
  { versionKey: false }
);

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", userSchema);
