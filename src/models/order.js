<<<<<<< HEAD
import { Schema, model } from 'mongoose';
=======
import { Schema, model } from "mongoose";
>>>>>>> 8e57b8edaf3522ee4e8fbfd2114b0e0f8aaf63f4

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
    required: true,
    default: Date.now(),
  },
  dateProcessed: {
    type: Date,
  },
});

export default model('Order', orderSchema);
