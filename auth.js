// Lightweight frontend auth - when backend available, this will call API
import { api } from './api.js';

const form = document.getElementById('auth-form');
const toggle = document.getElementById('btn-toggle');
const email = document.getElementById('email');
const password = document.getElementById('password');
const msg = document.getElementById('auth-msg');

let mode = 'login';
if(toggle) {
  toggle.addEventListener('click', ()=> {
    mode = mode === 'login' ? 'register' : 'login';
    toggle.textContent = mode === 'login' ? 'Create account' : 'Have an account? Login';
  });
}

if (form) {
  form.addEventListener('submit', async (e)=> {
    e.preventDefault();
    const payload = { email: email.value.trim(), password: password.value };
    try {
      // If API available, call backend; otherwise simulate
      if(window.API_BASE) {
        let res;
        if (mode === 'login') res = await api('/auth/login', { method: 'POST', body: payload });
        else res = await api('/auth/register', { method: 'POST', body: payload });
        localStorage.setItem('swad_token', res.token);
        localStorage.setItem('swad_user', JSON.stringify(res.user));
        msg.textContent = 'Success. Redirecting...';
        setTimeout(()=> location.href = '/', 700);
      } else {
        // simulate
        let users = JSON.parse(localStorage.getItem('swad_users') || '{}');
        if(mode === 'register') {
          if(users[payload.email]) { msg.textContent = 'Account exists'; return; }
          users[payload.email] = { email: payload.email, password: payload.password, name: '' };
          localStorage.setItem('swad_users', JSON.stringify(users));
          localStorage.setItem('swad_user', JSON.stringify({ email: payload.email }));
          msg.textContent = 'Account created';
          setTimeout(()=> location.href='/', 700);
        } else {
          if(!users[payload.email] || users[payload.email].password !== payload.password) { msg.textContent = 'Invalid credentials'; return; }
          localStorage.setItem('swad_user', JSON.stringify({ email: payload.email }));
          msg.textContent = 'Logged in';
          setTimeout(()=> location.href='/', 700);
        }
      }
    } catch (err) {
      msg.textContent = err?.body?.message || 'An error occurred';
    }
  });
}
