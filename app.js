// Frontend behavior: uses localStorage and optionally backend API (via api.js)
import { api } from './api.js';

const SELECTORS = {
  categoriesGrid: '#categories-grid',
  productsGrid: '#products-grid',
  filterCategory: '#filter-category',
  search: '#search',
  sort: '#sort',
  citySelect: '#city-select',
  cityName: '#city-name',
  cartCount: '#cart-count'
};

let cache = { categories: [], products: [], cities: [] };

async function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  await loadData();
  bindUI();
  renderCategories();
  renderProducts();
  updateCartUI();
}

function bindUI(){
  document.getElementById('order-now').addEventListener('click', ()=> document.querySelector('#products-section').scrollIntoView({behavior:'smooth'}));
  document.getElementById('explore-menu').addEventListener('click', ()=> document.querySelector('#categories-section').scrollIntoView({behavior:'smooth'}));
  document.getElementById('search').addEventListener('input', renderProducts);
  document.getElementById('filter-category').addEventListener('change', renderProducts);
  document.getElementById('sort').addEventListener('change', renderProducts);
  document.getElementById('btn-login').addEventListener('click', ()=> location.href='login.html');
  document.getElementById('btn-cart').addEventListener('click', ()=> location.href='cart.html');
  document.getElementById('theme-toggle').addEventListener('click', ()=> document.body.classList.toggle('dark'));
  const citySelect = document.getElementById('city-select');
  citySelect.addEventListener('change', ()=> {
    const id = citySelect.value;
    const city = cache.cities.find(c=>c._id===id || c.id===id);
    if(city) {
      document.getElementById('city-name').textContent = city.name;
      localStorage.setItem('swad_city', JSON.stringify(city));
    }
  });
}

async function loadData(){
  // try backend first; otherwise use demo data
  try {
    if(window.API_BASE) {
      const [cats, prods, cities] = await Promise.all([api('/categories'), api('/products'), api('/cities')]);
      cache.categories = cats;
      cache.products = prods;
      cache.cities = cities;
    } else {
      // demo local dataset
      cache.categories = [
        { _id:'c1', name:'Birthday Cakes', description:'Cakes for celebrations' },
        { _id:'c2', name:'Pastries', description:'Flaky & sweet pastries' },
        { _id:'c3', name:'Bread', description:'Fresh breads' }
      ];
      cache.products = [
        { _id:'p1', name:'Classic Chocolate Cake', description:'Rich chocolate sponge', price:450, discount:10, rating:4.8, category:cache.categories[0], image:'https://images.unsplash.com/photo-1542826438-2b58b1f1f9f7?q=80&w=1200&auto=format&fit=crop', deliveryTime:'45-60 min' },
        { _id:'p2', name:'Butter Croissant', description:'Buttery layered croissant', price:80, discount:0, rating:4.6, category:cache.categories[1], image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop', deliveryTime:'20-30 min' },
        { _id:'p3', name:'Sourdough Loaf', description:'Crusty sourdough loaf', price:220, discount:5, rating:4.4, category:cache.categories[2], image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop', deliveryTime:'30-45 min' }
      ];
      cache.cities = [{ _id:'city1', name:'Your City', code:'YC', serviceAreas:[{ name:'Area 1', pincode:'100001', deliveryCharge:25, estimatedMinutes:35 }]}];
    }
    // populate city select and filter category
    const citySel = document.getElementById('city-select');
    if(citySel){
      citySel.innerHTML = '';
      cache.cities.forEach(c=> citySel.insertAdjacentHTML('beforeend', `<option value="${c._id || c.id}">${c.name}</option>`));
      const saved = JSON.parse(localStorage.getItem('swad_city') || 'null') || cache.cities[0];
      if(saved) { citySel.value = saved._id || saved.id; document.getElementById('city-name').textContent = saved.name; }
    }
    const catSel = document.getElementById('filter-category');
    if(catSel){
      catSel.innerHTML = '<option value="">All</option>';
      cache.categories.forEach(c=> catSel.insertAdjacentHTML('beforeend', `<option value="${c._id}">${c.name}</option>`));
    }
  } catch(e) {
    console.error('loadData error', e);
  }
}

function renderCategories(){
  const g = document.getElementById('categories-grid');
  g.innerHTML = '';
  cache.categories.forEach(c=>{
    const d = document.createElement('div'); d.className = 'category-card';
    d.innerHTML = `<strong>${c.name}</strong><p class="muted">${c.description || ''}</p>`;
    d.addEventListener('click', ()=> {
      document.getElementById('filter-category').value = c._id;
      renderProducts();
      location.href = '#products-section';
    });
    g.appendChild(d);
  });
}

function renderProducts(){
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';
  const q = document.getElementById('search').value.trim().toLowerCase();
  const cat = document.getElementById('filter-category').value;
  const sort = document.getElementById('sort').value;
  let items = cache.products.slice();
  if(q) items = items.filter(p=> (p.name + ' ' + (p.description||'')).toLowerCase().includes(q));
  if(cat) items = items.filter(p=> (p.category && (p.category._id || p.category) === cat) || (p.category && p.category._id === cat));
  if(sort==='price_asc') items.sort((a,b)=>a.price - b.price);
  if(sort==='price_desc') items.sort((a,b)=>b.price - a.price);
  if(sort==='rating_desc') items.sort((a,b)=> (b.rating||0) - (a.rating||0));
  const tpl = document.getElementById('product-card');

  items.forEach(p=>{
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector('img');
    img.src = p.image || 'https://via.placeholder.com/600x400?text=Product';
    img.alt = p.name;
    node.querySelector('.product-title').textContent = p.name || p.title;
    node.querySelector('.product-desc').textContent = p.description || '';
    node.querySelector('.price-val').textContent = p.price;
    const addBtn = node.querySelector('.add-to-cart') || node.querySelector('.add-cart');
    if(addBtn) addBtn.addEventListener('click', ()=> addToCart(p));
    const videoBtn = node.querySelector('.video-btn');
    if(p.video && videoBtn) {
      videoBtn.hidden = false;
      videoBtn.addEventListener('click', ()=> openVideo(p));
    }
    grid.appendChild(node);
  });
}

function addToCart(product){
  const cart = JSON.parse(localStorage.getItem('swad_cart') || '[]');
  const existing = cart.find(i=>i._id === (product._id || product.id));
  if(existing) existing.qty++;
  else cart.push({ _id: product._id || product.id, name: product.name, price: product.price, qty: 1, image: product.image });
  localStorage.setItem('swad_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  const cart = JSON.parse(localStorage.getItem('swad_cart') || '[]');
  document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function openVideo(product){
  const modal = document.querySelector('#modal-video') || null;
  if(!modal) return;
  // omitted for brevity
}

init();
window.addEventListener('load', ()=> { setTimeout(()=> { if(window.lucide) lucide.replace(); }, 60); });