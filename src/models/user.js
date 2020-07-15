import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  roles: {
    admin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
});

export default mongoose.model('User', userSchema);
