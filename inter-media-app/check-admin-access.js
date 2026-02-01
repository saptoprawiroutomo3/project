const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function checkAdminAccess() {
  const uri = "mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/intermediadb?retryWrites=true&w=majority&appName=Cluster0";
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('intermediadb');
    
    console.log('🔍 Checking admin accounts in database...\n');
    
    // Check all users with admin/kasir roles
    const adminUsers = await db.collection('users').find({
      role: { $in: ['admin', 'kasir'] }
    }).toArray();
    
    console.log(`👥 Found ${adminUsers.length} admin/kasir accounts:`);
    
    for (const user of adminUsers) {
      console.log(`\n📋 User: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      
      // Test password verification
      if (user.email === 'admin@intermedia.com' && user.password) {
        try {
          const isValidPassword = await bcrypt.compare('admin123', user.password);
          console.log(`   Password 'admin123' valid: ${isValidPassword ? '✅' : '❌'}`);
        } catch (error) {
          console.log(`   Password check error: ${error.message}`);
        }
      }
      
      if (user.email === 'kasir@intermedia.com' && user.password) {
        try {
          const isValidPassword = await bcrypt.compare('kasir123', user.password);
          console.log(`   Password 'kasir123' valid: ${isValidPassword ? '✅' : '❌'}`);
        } catch (error) {
          console.log(`   Password check error: ${error.message}`);
        }
      }
      
      console.log(`   Has password: ${user.password ? '✅' : '❌'}`);
      if (user.password) {
        console.log(`   Password hash length: ${user.password.length}`);
      }
    }
    
    // Check if admin@intermedia.com exists
    const adminUser = await db.collection('users').findOne({ email: 'admin@intermedia.com' });
    
    if (!adminUser) {
      console.log('\n❌ Admin user not found! Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const newAdmin = {
        name: 'Admin Inter Media',
        email: 'admin@intermedia.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('users').insertOne(newAdmin);
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('\n✅ Admin user exists in database');
    }
    
    // Check if kasir@intermedia.com exists
    const kasirUser = await db.collection('users').findOne({ email: 'kasir@intermedia.com' });
    
    if (!kasirUser) {
      console.log('\n❌ Kasir user not found! Creating kasir user...');
      
      const hashedPassword = await bcrypt.hash('kasir123', 12);
      
      const newKasir = {
        name: 'Kasir Inter Media',
        email: 'kasir@intermedia.com',
        password: hashedPassword,
        role: 'kasir',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('users').insertOne(newKasir);
      console.log('✅ Kasir user created successfully!');
    } else {
      console.log('\n✅ Kasir user exists in database');
    }
    
    console.log('\n🔐 Login credentials:');
    console.log('Admin: admin@intermedia.com / admin123');
    console.log('Kasir: kasir@intermedia.com / kasir123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkAdminAccess();
