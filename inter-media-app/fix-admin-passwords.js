const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function fixAdminPasswords() {
  const uri = "mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/intermediadb?retryWrites=true&w=majority&appName=Cluster0";
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('intermediadb');
    
    console.log('🔧 Fixing admin passwords...\n');
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const kasirPassword = await bcrypt.hash('kasir123', 12);
    
    // Update admin password
    const adminResult = await db.collection('users').updateOne(
      { email: 'admin@intermedia.com' },
      { 
        $set: { 
          password: adminPassword,
          updatedAt: new Date()
        }
      }
    );
    
    console.log(`📋 Admin password updated: ${adminResult.modifiedCount > 0 ? '✅' : '❌'}`);
    
    // Update kasir password
    const kasirResult = await db.collection('users').updateOne(
      { email: 'kasir@intermedia.com' },
      { 
        $set: { 
          password: kasirPassword,
          updatedAt: new Date()
        }
      }
    );
    
    console.log(`📋 Kasir password updated: ${kasirResult.modifiedCount > 0 ? '✅' : '❌'}`);
    
    // Verify passwords work
    console.log('\n🧪 Testing passwords...');
    
    const adminUser = await db.collection('users').findOne({ email: 'admin@intermedia.com' });
    if (adminUser && adminUser.password) {
      const adminValid = await bcrypt.compare('admin123', adminUser.password);
      console.log(`Admin login test: ${adminValid ? '✅' : '❌'}`);
    }
    
    const kasirUser = await db.collection('users').findOne({ email: 'kasir@intermedia.com' });
    if (kasirUser && kasirUser.password) {
      const kasirValid = await bcrypt.compare('kasir123', kasirUser.password);
      console.log(`Kasir login test: ${kasirValid ? '✅' : '❌'}`);
    }
    
    console.log('\n✅ Admin accounts are now ready!');
    console.log('🔐 Login at: https://inter-media-apps.vercel.app/login');
    console.log('📧 Admin: admin@intermedia.com / admin123');
    console.log('📧 Kasir: kasir@intermedia.com / kasir123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixAdminPasswords();
