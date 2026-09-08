const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  label: String,
  line1: String,
  line2: String,
  city: String,
  pincode: String,
  phone: String,
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type:String, required:true, unique:true },
  password: { type:String, required:true },
  phone: String,
  isAdmin: { type:Boolean, default:false },
  addresses: [AddressSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);