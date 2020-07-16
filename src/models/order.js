import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: [
    {
      _id: false,
      qty: Number,
      productId: { type: String, ref: "Product" },
    },
  ],
  status: {
    type: String,
    default: "pending",
  },
  dateEntry: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  dateProcessed: {
    type: Date,
    required: false,
  },
});

export default model('Order', orderSchema);
