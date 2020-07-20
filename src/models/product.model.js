import mongoose from 'mongoose';

const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
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
      default: 'Burgers',
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

export default mongoose.model('Product', productSchema);
