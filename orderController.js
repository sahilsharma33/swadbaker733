const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY_ID || '',
  key_secret: process.env.RZP_KEY_SECRET || ''
});

exports.createOrder = async (req,res) => {
  // expects: items [{productId, qty}], cityId, serviceAreaName, address, paymentMethod ('cod'|'razorpay')
  const { items, cityId, serviceAreaName, address, paymentMethod } = req.body;
  if(!items || items.length===0) return res.status(400).json({message:'Cart empty'});
  const productDocs = await Product.find({_id: {$in: items.map(i=>i.productId)}});
  const itemsOut = items.map(it => {
    const p = productDocs.find(x=>x._id.equals(it.productId));
    return { product: p._id, name: p.name, price: p.price, qty: it.qty };
  });
  const subtotal = itemsOut.reduce((s,i)=>s + i.price * i.qty, 0);
  const deliveryCharge = (req.body.deliveryCharge != null) ? req.body.deliveryCharge : 30;
  const total = subtotal + deliveryCharge;
  const order = await Order.create({
    user: req.user ? req.user._id : null,
    items: itemsOut,
    total,
    deliveryCharge,
    city: cityId,
    serviceAreaName,
    address,
    paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
    status: 'PLACED'
  });

  if(paymentMethod === 'razorpay') {
    const razorOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: order._id.toString(),
      notes: { orderId: order._id.toString() }
    });
    order.razorpayOrderId = razorOrder.id;
    await order.save();
    return res.json({ order, razorpayOrder: razorOrder });
  }
  res.json({ order });
};

exports.verifyPayment = async (req,res) => {
  // expects razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const digest = hmac.digest('hex');
  if(digest === razorpay_signature) {
    const order = await Order.findById(orderId);
    if(order) {
      order.paymentStatus = 'PAID';
      await order.save();
      return res.json({ ok:true });
    }
    return res.status(404).json({message:'Order not found'});
  } else {
    return res.status(400).json({message:'Invalid signature'});
  }
};

exports.listUserOrders = async (req,res)=> {
  const userId = req.user ? req.user._id : null;
  if(!userId) return res.status(403).json({message:'Login required'});
  const orders = await Order.find({ user: userId }).populate('items.product').sort({createdAt:-1});
  res.json(orders);
};

exports.adminListOrders = async (req,res) => {
  const orders = await Order.find().populate('user').sort({createdAt:-1});
  res.json(orders);
};

exports.updateStatus = async (req,res) => {
  const { status } = req.body;
  const o = await Order.findById(req.params.id);
  if(!o) return res.status(404).json({message:'Not found'});
  o.status = status;
  await o.save();
  res.json(o);
};