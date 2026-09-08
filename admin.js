const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

router.get('/metrics', auth, adminOnly, async (req,res)=> {
  const totalOrders = await Order.countDocuments();
  const today = new Date(); today.setHours(0,0,0,0);
  const todaysOrders = await Order.countDocuments({ createdAt: { $gte: today }});
  const revenueAgg = await Order.aggregate([{ $match: { paymentStatus: 'PAID' }},{ $group: {_id:null, total: { $sum: '$total' }}}]);
  const revenue = revenueAgg[0] ? revenueAgg[0].total : 0;
  const customers = await User.countDocuments();
  const products = await Product.countDocuments();
  res.json({ totalOrders, todaysOrders, revenue, customers, products });
});

module.exports = router;