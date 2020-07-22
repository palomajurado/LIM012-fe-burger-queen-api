const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new Schema(
  {
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
        product: { type: String, ref: 'Product' },
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
      required: false,
    },
  },
  { versionKey: false },
);

orderSchema.plugin(mongoosePaginate);
module.exports = model('Order', orderSchema);
