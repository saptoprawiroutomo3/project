const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔍 Attempting to connect to MongoDB...');
    console.log('🔍 MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
    
    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('💥 Database connection error:', error.message);
    console.error('💥 Full error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
