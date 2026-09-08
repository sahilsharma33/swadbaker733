# Swad Bakers

Swad Bakers — city-focused bakery & delivery platform (starter scaffold)

This repository contains a full-stack scaffold:

- Frontend: Plain HTML/CSS/Vanilla JS (frontend/)
- Backend: Node.js + Express + MongoDB (backend/)
- Python worker: small order progression simulator (worker/)

Features
- Landing page with background video (frontend)
- Categories, product listing, search & filters
- Product detail, cart (client-side), simulated multi-step checkout
- JWT auth (backend)
- City & service areas with delivery charges & ETA
- Orders, order tracking, admin endpoints
- Razorpay server-side wiring (test-mode placeholders) — DO NOT commit live keys

Quickstart (development)

1. Install MongoDB (local) or use Atlas and set MONGODB_URI in backend/.env.

2. Backend
   - cd backend
   - cp .env.example .env and fill values (MONGODB_URI, JWT_SECRET, FRONTEND_URL)
   - npm install
   - npm run seed    # creates admin user and sample data
   - npm run dev     # starts server (nodemon)

3. Frontend
   - Serve frontend folder (optional). The backend serves frontend files when running server, so open http://localhost:5000/
   - Or in a separate terminal run a static server inside frontend/:
     - npx http-server ./frontend -p 8080
     - open http://localhost:8080

4. Worker (optional)
   - Obtain admin JWT by logging in (POST /api/auth/login). Use returned token as ADMIN_TOKEN.
   - ADMIN_TOKEN="Bearer <token>" python3 worker/worker.py

Environment variables
- See backend/.env.example. NEVER commit real secrets.

Notes
- This scaffold is for local development/demo. Replace placeholder assets and wire real payment keys for production.
- Do not commit .env or node_modules.

License: MIT