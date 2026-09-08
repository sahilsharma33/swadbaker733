const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req,res)=> {
  const cats = await Category.find();
  res.json(cats);
});

router.post('/', auth, adminOnly, async (req,res)=> {
  const c = await Category.create(req.body);
  res.json(c);
});

module.exports = router;