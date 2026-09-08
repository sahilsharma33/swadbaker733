const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not provided');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
};

module.exports = connectDB;