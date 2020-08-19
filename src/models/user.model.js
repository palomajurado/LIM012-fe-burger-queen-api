const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      validate: {
        validator: (v) => /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(v),
        message: (props) => `${props.value} is not a valid Email!`,
      },
      unique: true,
    },
    password: {
      type: String,
      require: true,
      validate: {
        validator: (v) => v.length >= 5,
        message: (props) => `${props.value} is not a valid Password!`,
      },
    },
    roles: { admin: { type: Boolean, default: false } },
  },
  { versionKey: false },
);

userSchema.methods.encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error(err);
  }
};

userSchema.methods.comparePassword = async function comparePassword(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.error(err);
  }
};

userSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser único',
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
