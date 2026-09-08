const mongoose = require('mongoose');

const ServiceAreaSchema = new mongoose.Schema({
  name: String,
  pincode: String,
  deliveryCharge: { type:Number, default: 30 },
  estimatedMinutes: { type:Number, default: 45 }
});

const CitySchema = new mongoose.Schema({
  name: { type:String, required:true, unique:true },
  code: String,
  serviceAreas: [ServiceAreaSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('City', CitySchema);