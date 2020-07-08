import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  imagen: String,
  type: String,
});

export default mongoose.model("Users", productSchema);
