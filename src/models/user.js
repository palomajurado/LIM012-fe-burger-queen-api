import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: {},
  roles: { admin: true },
});

export default mongoose.model('User', userSchema);
