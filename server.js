require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const Razorpay = require('razorpay');

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// Environment variables
// ===============================
console.log("RZP_KEY_ID =", process.env.RZP_KEY_ID);
console.log(
    "RZP_KEY_SECRET =",
    process.env.RZP_KEY_SECRET ? "LOADED" : "MISSING"
);

// ===============================
// Razorpay
// ===============================
const razorpay = new Razorpay({
    key_id: process.env.RZP_KEY_ID,
    key_secret: process.env.RZP_KEY_SECRET
});

console.log("Razorpay Key:", process.env.RZP_KEY_ID);

// ===============================
// MongoDB
// ===============================
connectDB(process.env.MONGODB_URI)
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

// ===============================
// Middleware
// ===============================
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));

app.use(express.json());

app.use(morgan('dev'));

// ===============================
// API Routes
// ===============================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// ===============================
// Frontend
// ===============================
const frontendPath = __dirname;

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
// ===============================
// Error Handler
// ===============================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: 'Server error'
    });
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});