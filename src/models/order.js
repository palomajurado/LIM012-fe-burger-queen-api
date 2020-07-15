/* eslint-disable linebreak-style */
/* eslint-disable quotes */
import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  userId: String,
  client: String,
  products: [{ _id: false, qty: Number, productId: String }],
  status: String,
  dateEntry: {
    type: Date,
    default: Date.now(),
  },
  dateProcessed: { type: Date },
});

export default model("Order", orderSchema);
