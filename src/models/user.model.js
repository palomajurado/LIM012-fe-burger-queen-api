import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  email: {
    type: Object, require: true, unique: true, lowercase: true,
  },
  password: { type: String, require: true },
  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
  versionKey: false,
});

userSchema.methods.encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error(err);
  }
};

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model('User', userSchema);
