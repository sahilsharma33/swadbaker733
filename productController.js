const Product = require('../models/Product');
const Category = require('../models/Category');

exports.list = async (req,res) => {
  const products = await Product.find().populate('category').lean();
  res.json(products);
};

exports.get = async (req,res) => {
  const p = await Product.findById(req.params.id).populate('category');
  if(!p) return res.status(404).json({message:'Not found'});
  res.json(p);
};

exports.create = async (req,res) => {
  const data = req.body;
  const p = await Product.create(data);
  res.json(p);
};

exports.update = async (req,res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(p);
};

exports.delete = async (req,res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ok:true});
};

exports.listCategories = async (req,res) => {
  const cats = await Category.find();
  res.json(cats);
};