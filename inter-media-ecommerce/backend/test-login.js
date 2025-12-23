require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin user exists
    const admin = await User.findOne({ email: 'admin@test.com' });
    if (admin) {
      console.log('Admin user found:', {
        email: admin.email,
        role: admin.role,
        isVerified: admin.isVerified,
        isActive: admin.isActive
      });
    } else {
      console.log('Admin user not found. Creating one...');
      
      const newAdmin = new User({
        name: 'Admin',
        email: 'admin@test.com',
        password: '123456',
        phone: '08123456789',
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      
      await newAdmin.save();
      console.log('Admin user created successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();
