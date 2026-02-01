const { MongoClient } = require('mongodb');

async function updateReportsDataDates() {
  const uri = "mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/intermediadb?retryWrites=true&w=majority&appName=Cluster0";
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('intermediadb');
    
    console.log('🔄 Updating dates to recent dates for reports...\n');
    
    // Get current date and create date range for last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Update Sales Transactions
    const salesTransactions = await db.collection('salestransactions').find().toArray();
    console.log(`📊 Updating ${salesTransactions.length} sales transactions...`);
    
    for (let i = 0; i < salesTransactions.length; i++) {
      const transaction = salesTransactions[i];
      // Spread dates over last 30 days
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const newDate = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      await db.collection('salestransactions').updateOne(
        { _id: transaction._id },
        { $set: { createdAt: newDate, updatedAt: newDate } }
      );
    }
    
    // Update Orders
    const orders = await db.collection('orders').find().toArray();
    console.log(`🛒 Updating ${orders.length} orders...`);
    
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const newDate = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      await db.collection('orders').updateOne(
        { _id: order._id },
        { $set: { createdAt: newDate, updatedAt: newDate } }
      );
    }
    
    // Update Service Requests
    const services = await db.collection('servicerequests').find().toArray();
    console.log(`🔧 Updating ${services.length} service requests...`);
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const newDate = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      await db.collection('servicerequests').updateOne(
        { _id: service._id },
        { $set: { createdAt: newDate, updatedAt: newDate } }
      );
    }
    
    console.log('\n✅ All dates updated successfully!');
    console.log(`📅 Date range: ${thirtyDaysAgo.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateReportsDataDates();
