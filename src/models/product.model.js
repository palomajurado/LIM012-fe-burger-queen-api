const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: 'burger1.jpg',
    },
    type: {
      type: String,
      required: false,
    },
    dateEntry: {
      type: Date,
      default: Date.now(),
      required: true,
    },
  },
  { versionKey: false },
);

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
