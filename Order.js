const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  qty: Number
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: [OrderItemSchema],
  total: Number,
  deliveryCharge: Number,
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  serviceAreaName: String,
  address: String,
  status: { type: String, enum: ['PLACED','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'], default: 'PLACED' },
  paymentStatus: { type: String, enum: ['PENDING','PAID','FAILED'], default: 'PENDING' },
  razorpayOrderId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);