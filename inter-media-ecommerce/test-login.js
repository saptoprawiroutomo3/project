#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'http://localhost:3002/api';

async function testLogin() {
  try {
    console.log('🔄 Testing login API...');
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'customer@demo.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Login berhasil!');
    console.log('📊 Response:', {
      status: response.status,
      message: response.data.message,
      user: response.data.user.name,
      role: response.data.user.role
    });

  } catch (error) {
    console.log('❌ Login gagal!');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔌 Server tidak berjalan di port 3002');
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timeout');
    } else if (error.response) {
      console.log('📋 Error response:', {
        status: error.response.status,
        message: error.response.data?.message || 'Unknown error'
      });
    } else {
      console.log('🔍 Error:', error.message);
    }
  }
}

testLogin();
