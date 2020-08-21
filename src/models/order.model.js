const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new Schema(
  {
    userId: {
      type: String,
    },
    client: {
      type: String,
    },
    products: [
      {
        _id: false,
        qty: Number,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
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
    },
  },
  { versionKey: false },
);

orderSchema.plugin(mongoosePaginate);
module.exports = model('Order', orderSchema);
