import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
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
});

export default mongoose.model('Product', productSchema);
