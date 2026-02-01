const { MongoClient, ObjectId } = require('mongodb');

async function addMoreReportsData() {
  const uri = "mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/intermediadb?retryWrites=true&w=majority&appName=Cluster0";
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('intermediadb');
    
    console.log('📈 Adding more data for comprehensive reports...\n');
    
    // Get existing codes to avoid duplicates
    const existingPosCodes = await db.collection('salestransactions').distinct('transactionCode');
    const existingOrderCodes = await db.collection('orders').distinct('orderCode');
    const existingServiceCodes = await db.collection('servicerequests').distinct('serviceCode');
    
    // Get some products for transactions
    const products = await db.collection('products').find().limit(20).toArray();
    const users = await db.collection('users').find({ role: 'customer' }).toArray();
    
    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      return;
    }
    
    // Add more POS transactions
    console.log('📊 Adding POS transactions...');
    const posTransactions = [];
    
    let posCounter = 200; // Start from 200 to avoid conflicts
    for (let i = 0; i < 25; i++) {
      let transactionCode;
      do {
        transactionCode = `POS-${String(posCounter++).padStart(3, '0')}`;
      } while (existingPosCodes.includes(transactionCode));
      
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const transactionDate = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      // Random 1-3 items per transaction
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let total = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const subtotal = product.price * quantity;
        
        items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          subtotal: subtotal
        });
        
        total += subtotal;
      }
      
      posTransactions.push({
        transactionCode: transactionCode,
        cashierName: 'Kasir Demo',
        customerName: `Customer ${i + 1}`,
        items: items,
        total: total,
        paymentMethod: Math.random() > 0.5 ? 'cash' : 'card',
        createdAt: transactionDate,
        updatedAt: transactionDate
      });
    }
    
    await db.collection('salestransactions').insertMany(posTransactions);
    console.log(`✅ Added ${posTransactions.length} POS transactions`);
    
    // Add more online orders
    console.log('🛒 Adding online orders...');
    const onlineOrders = [];
    
    let orderCounter = 200; // Start from 200 to avoid conflicts
    for (let i = 0; i < 20; i++) {
      let orderCode;
      do {
        orderCode = `ORD-${String(orderCounter++).padStart(3, '0')}`;
      } while (existingOrderCodes.includes(orderCode));
      
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      const user = users[Math.floor(Math.random() * users.length)];
      const itemCount = Math.floor(Math.random() * 4) + 1;
      const items = [];
      let total = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const subtotal = product.price * quantity;
        
        items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          subtotal: subtotal
        });
        
        total += subtotal;
      }
      
      const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      onlineOrders.push({
        orderNumber: orderCode,
        orderCode: orderCode,
        userId: user?._id || new ObjectId(),
        customerInfo: {
          name: user?.name || `Customer ${i + 1}`,
          email: user?.email || `customer${i + 1}@example.com`,
          phone: `08123456${String(i).padStart(3, '0')}`
        },
        items: items,
        total: total,
        status: status,
        paymentMethod: 'transfer',
        shippingAddress: {
          street: `Jl. Test ${i + 1}`,
          city: 'Jakarta',
          postalCode: '12345'
        },
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }
    
    await db.collection('orders').insertMany(onlineOrders);
    console.log(`✅ Added ${onlineOrders.length} online orders`);
    
    // Add more service requests
    console.log('🔧 Adding service requests...');
    const serviceRequests = [];
    
    const serviceTypes = ['Printer Repair', 'Fotocopy Maintenance', 'Computer Service', 'Network Setup'];
    const serviceStatuses = ['received', 'in_progress', 'completed', 'delivered'];
    
    let serviceCounter = 200; // Start from 200 to avoid conflicts
    for (let i = 0; i < 15; i++) {
      let serviceCode;
      do {
        serviceCode = `SRV-${String(serviceCounter++).padStart(3, '0')}`;
      } while (existingServiceCodes.includes(serviceCode));
      
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const serviceDate = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      const user = users[Math.floor(Math.random() * users.length)];
      const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
      const status = serviceStatuses[Math.floor(Math.random() * serviceStatuses.length)];
      
      serviceRequests.push({
        serviceCode: serviceCode,
        userId: user?._id || new ObjectId(),
        customerInfo: {
          name: user?.name || `Customer ${i + 1}`,
          email: user?.email || `customer${i + 1}@example.com`,
          phone: `08123456${String(i).padStart(3, '0')}`
        },
        deviceType: serviceType.split(' ')[0],
        deviceBrand: ['Canon', 'Epson', 'HP', 'Brother'][Math.floor(Math.random() * 4)],
        problemDescription: `${serviceType} - Issue ${i + 1}`,
        status: status,
        estimatedCost: Math.floor(Math.random() * 500000) + 100000,
        actualCost: status === 'completed' ? Math.floor(Math.random() * 500000) + 100000 : null,
        createdAt: serviceDate,
        updatedAt: serviceDate
      });
    }
    
    await db.collection('servicerequests').insertMany(serviceRequests);
    console.log(`✅ Added ${serviceRequests.length} service requests`);
    
    console.log('\n🎉 Successfully added comprehensive reports data!');
    console.log('📊 Reports should now show rich data with charts and analytics');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

addMoreReportsData();
