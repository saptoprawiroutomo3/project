const { MongoClient } = require('mongodb');

async function checkReportsData() {
  const uri = "mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/intermediadb?retryWrites=true&w=majority&appName=Cluster0";
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('intermediadb');
    
    console.log('🔍 Checking database collections for reports data...\n');
    
    // Check Sales Transactions (POS)
    const salesCount = await db.collection('salestransactions').countDocuments();
    console.log(`📊 Sales Transactions (POS): ${salesCount} records`);
    
    if (salesCount > 0) {
      const sampleSales = await db.collection('salestransactions').findOne();
      console.log('Sample sales transaction:', {
        transactionCode: sampleSales?.transactionCode,
        total: sampleSales?.total,
        createdAt: sampleSales?.createdAt
      });
    }
    
    // Check Orders (Online)
    const ordersCount = await db.collection('orders').countDocuments();
    console.log(`\n🛒 Orders (Online): ${ordersCount} records`);
    
    if (ordersCount > 0) {
      const sampleOrder = await db.collection('orders').findOne();
      console.log('Sample order:', {
        orderNumber: sampleOrder?.orderNumber,
        total: sampleOrder?.total || sampleOrder?.totalAmount,
        status: sampleOrder?.status,
        createdAt: sampleOrder?.createdAt
      });
    }
    
    // Check Service Requests
    const servicesCount = await db.collection('servicerequests').countDocuments();
    console.log(`\n🔧 Service Requests: ${servicesCount} records`);
    
    // Check Products (for stock)
    const productsCount = await db.collection('products').countDocuments();
    console.log(`\n📦 Products: ${productsCount} records`);
    
    if (productsCount > 0) {
      const sampleProduct = await db.collection('products').findOne();
      console.log('Sample product:', {
        name: sampleProduct?.name,
        stock: sampleProduct?.stock,
        price: sampleProduct?.price
      });
    }
    
    // Check Users
    const usersCount = await db.collection('users').countDocuments();
    console.log(`\n👥 Users: ${usersCount} records`);
    
    console.log('\n✅ Database check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkReportsData();
