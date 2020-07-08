import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String },
  roles: { admin: Boolean },
});

export default mongoose.model("User", userSchema);
