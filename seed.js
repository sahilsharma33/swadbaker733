require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const City = require('../models/City');
const bcrypt = require('bcrypt');

async function seed() {
  await connectDB(process.env.MONGODB_URI);
  console.log('Seeding data...');
  const adminEmail = 'admin@swadbakers.local';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if(!existingAdmin) {
    const hash = await bcrypt.hash('adminpass', 10);
    await User.create({ name:'Admin', email: adminEmail, password: hash, isAdmin:true });
    console.log('Admin user created:', adminEmail, 'password: adminpass');
  }

  const categories = [
    { name:'Birthday Cakes', description:'Cakes for celebrations' },
    { name:'Pastries', description:'Flaky, sweet pastries' },
    { name:'Bread', description:'Fresh breads' },
    { name:'Cookies', description:'Crispy & soft cookies' },
    { name:'Beverages', description:'Hot & cold drinks' }
  ];
  for(const c of categories){
    const found = await Category.findOne({ name: c.name });
    if(!found) await Category.create(c);
  }
  const cakeCat = await Category.findOne({ name: 'Birthday Cakes' });
  const pastryCat = await Category.findOne({ name: 'Pastries' });
  const breadCat = await Category.findOne({ name: 'Bread' });

  const sampleProducts = [
    { name:'Classic Chocolate Cake', description:'Rich chocolate sponge with ganache', price:450, category: cakeCat._id, image:'https://images.unsplash.com/photo-1542826438-2b58b1f1f9f7?q=80&w=800&auto=format&fit=crop', deliveryTime:'45-60 min', tags:['popular'] },
    { name:'Butter Croissant', description:'Buttery layered croissant', price:80, category: pastryCat._id, image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop', deliveryTime:'20-30 min' },
    { name:'Sourdough Loaf', description:'Crusty sourdough loaf', price:220, category: breadCat._id, image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop', deliveryTime:'30-45 min' }
  ];
  for(const p of sampleProducts){
    const found = await Product.findOne({ name: p.name });
    if(!found) await Product.create(p);
  }

  const myCity = await City.findOne({ name: 'Your City' });
  if(!myCity){
    await City.create({
      name: 'Your City',
      code: 'YC',
      serviceAreas: [
        { name: 'Area 1', pincode: '100001', deliveryCharge: 25, estimatedMinutes: 35 },
        { name: 'Area 2', pincode: '100002', deliveryCharge: 35, estimatedMinutes: 45 }
      ]
    });
  }
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});