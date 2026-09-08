const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type:String, required:true },
  description: String,
  price: { type:Number, required:true },
  discount: { type:Number, default:0 },
  rating: { type:Number, default:0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: String,
  deliveryTime: String,
  available: { type:Boolean, default:true },
  tags: [String],
  createdAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);