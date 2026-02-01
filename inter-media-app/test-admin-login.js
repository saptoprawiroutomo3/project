const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login via API...\n');
    
    // Test admin login
    console.log('📧 Testing admin@intermedia.com...');
    
    const loginResponse = await axios.post('https://inter-media-apps.vercel.app/api/auth/signin', {
      email: 'admin@intermedia.com',
      password: 'admin123',
      redirect: false
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', loginResponse.status);
    console.log('Response data:', loginResponse.data);
    
    if (loginResponse.status === 200) {
      console.log('✅ Admin login successful!');
    } else {
      console.log('❌ Admin login failed');
    }
    
  } catch (error) {
    console.log('❌ Login test error:', error.response?.data || error.message);
    
    // Try alternative test - check if user exists via direct API
    try {
      console.log('\n🔍 Testing user existence...');
      const userCheck = await axios.get('https://inter-media-apps.vercel.app/api/debug-users');
      console.log('Users API response:', userCheck.data);
    } catch (apiError) {
      console.log('API test error:', apiError.message);
    }
  }
}

testAdminLogin();
