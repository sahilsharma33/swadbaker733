// Simple API wrapper (use when backend is wired)
const API_BASE = window.API_BASE || (location.origin + '/api');

export async function api(path, opts = {}) {
  const token = localStorage.getItem('swad_token');
  const headers = opts.headers || {};
  if (!opts.body || typeof opts.body === 'object') headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, {...opts, headers, body: opts.body && typeof opts.body === 'object' ? JSON.stringify(opts.body) : opts.body});
  const json = await res.json().catch(() => null);
  if (!res.ok) throw {status: res.status, body: json};
  return json;
}