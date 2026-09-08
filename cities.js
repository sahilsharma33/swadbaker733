const express = require('express');
const router = express.Router();
const City = require('../models/City');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req,res)=> {
  const cities = await City.find();
  res.json(cities);
});

router.post('/', auth, adminOnly, async (req,res)=> {
  const c = await City.create(req.body);
  res.json(c);
});

module.exports = router;