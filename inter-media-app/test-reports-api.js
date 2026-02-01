const { MongoClient } = require('mongodb');

async function testReportsAPI() {
  const uri = "mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/intermediadb?retryWrites=true&w=majority&appName=Cluster0";
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('intermediadb');
    
    console.log('🧪 Testing reports data after date update...\n');
    
    // Test date range (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const dateFilter = {
      createdAt: {
        $gte: thirtyDaysAgo,
        $lte: now
      }
    };
    
    // Check Sales Transactions in date range
    const salesInRange = await db.collection('salestransactions').find(dateFilter).toArray();
    console.log(`📊 Sales Transactions (last 30 days): ${salesInRange.length} records`);
    
    if (salesInRange.length > 0) {
      const totalSales = salesInRange.reduce((sum, txn) => sum + (Number(txn.total) || 0), 0);
      console.log(`💰 Total Sales Revenue: Rp ${totalSales.toLocaleString()}`);
    }
    
    // Check Orders in date range
    const ordersInRange = await db.collection('orders').find(dateFilter).toArray();
    console.log(`\n🛒 Orders (last 30 days): ${ordersInRange.length} records`);
    
    if (ordersInRange.length > 0) {
      const totalOrders = ordersInRange.reduce((sum, order) => {
        const amount = Number(order.total) || Number(order.totalAmount) || 0;
        return sum + amount;
      }, 0);
      console.log(`💰 Total Orders Revenue: Rp ${totalOrders.toLocaleString()}`);
    }
    
    // Check Service Requests in date range
    const servicesInRange = await db.collection('servicerequests').find(dateFilter).toArray();
    console.log(`\n🔧 Service Requests (last 30 days): ${servicesInRange.length} records`);
    
    // Check Products for stock report
    const products = await db.collection('products').find().toArray();
    const lowStockProducts = products.filter(p => p.stock < 10);
    console.log(`\n📦 Products: ${products.length} total, ${lowStockProducts.length} low stock`);
    
    console.log('\n✅ Reports should now show data!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testReportsAPI();
