/* eslint-disable linebreak-style */
/* eslint-disable quotes */
import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: [{
    _id: false, qty: Number, productId: String, product: Object,
  }],
  status: {
    type: String,
    default: 'pending',
  },
  dateEntry: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  dateProcessed: {
    type: Date,
    required: true,
  },
});

export default model("Order", orderSchema);
