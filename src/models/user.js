import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: {},
  roles: { admin: true },
});

const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  imagen: String,
  type: String,
});

export default mongoose.model("Users", productSchema);
