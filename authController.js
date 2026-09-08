const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req,res) => {
  const { email, password, name } = req.body;
  if(!email || !password) return res.status(400).json({message:'Email and password required'});
  try {
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({message:'Email already registered'});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, email: user.email, name: user.name }});
  } catch(e) { console.error(e); res.status(500).json({message:'Server error'}) }
};

exports.login = async (req,res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({message:'Email and password required'});
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({message:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, email: user.email, name: user.name }});
  } catch(e) { console.error(e); res.status(500).json({message:'Server error'}) }
};