const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const { createSlug, generateSKU } = require('./src/utils/helpers');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users (password akan di-hash otomatis oleh pre-save hook)
    
    const users = await User.create([
      {
        name: 'Demo Customer',
        email: 'customer@demo.com',
        password: 'password123',
        phone: '081234567890',
        role: 'customer',
        isVerified: true,
        addresses: [{
          label: 'Home',
          recipientName: 'Demo Customer',
          phone: '081234567890',
          address: 'Jl. Sudirman No. 123',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          postalCode: '12190',
          isDefault: true
        }]
      },
      {
        name: 'Demo Seller',
        email: 'seller@demo.com',
        password: 'password123',
        phone: '081234567891',
        role: 'seller',
        isVerified: true,
        sellerInfo: {
          storeName: 'Tech Solutions Store',
          storeDescription: 'Your trusted partner for printer and computer solutions',
          storeAddress: 'Jl. Gatot Subroto No. 456',
          storePhone: '021-12345678',
          bankAccount: {
            bankName: 'BCA',
            accountNumber: '1234567890',
            accountName: 'Demo Seller'
          },
          isVerified: true,
          rating: 4.8,
          totalSales: 150
        }
      },
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: 'password123',
        phone: '081234567892',
        role: 'admin',
        isVerified: true
      }
    ]);

    console.log('Created demo users');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Printers',
        slug: 'printers',
        description: 'All types of printers for home and office use'
      },
      {
        name: 'Computers',
        slug: 'computers',
        description: 'Desktop computers, laptops, and accessories'
      },
      {
        name: 'Spare Parts',
        slug: 'spareparts',
        description: 'Computer and printer spare parts and components'
      },
      {
        name: 'Office Equipment',
        slug: 'office-equipment',
        description: 'Complete office equipment solutions'
      },
      {
        name: 'Services',
        slug: 'services',
        description: 'Professional repair and maintenance services'
      }
    ]);

    console.log('Created categories');

    // Create sample products
    const seller = users.find(u => u.role === 'seller');
    const printerCategory = categories.find(c => c.slug === 'printers');
    const computerCategory = categories.find(c => c.slug === 'computers');
    const sparepartsCategory = categories.find(c => c.slug === 'spareparts');

    const products = await Product.create([
      {
        name: 'Canon PIXMA G3010 All-in-One Printer',
        slug: createSlug('Canon PIXMA G3010 All-in-One Printer'),
        description: 'Canon PIXMA G3010 is a wireless all-in-one printer with refillable ink tanks. Perfect for home and small office use with high-quality printing, scanning, and copying capabilities.',
        shortDescription: 'Wireless all-in-one printer with refillable ink tanks',
        images: [
          { url: '/uploads/products/canon-g3010.jpg', alt: 'Canon PIXMA G3010' }
        ],
        category: printerCategory._id,
        seller: seller._id,
        price: 2450000,
        comparePrice: 2750000,
        cost: 2200000,
        sku: generateSKU('Canon PIXMA G3010', 'Printers'),
        stock: 25,
        specifications: [
          { name: 'Print Technology', value: 'Inkjet' },
          { name: 'Print Speed', value: '8.8 ipm (black), 5.0 ipm (color)' },
          { name: 'Connectivity', value: 'Wi-Fi, USB' },
          { name: 'Paper Size', value: 'A4, Letter, Legal' }
        ],
        weight: 5.8,
        dimensions: { length: 445, width: 330, height: 163 },
        tags: ['canon', 'printer', 'wireless', 'all-in-one'],
        isFeatured: true,
        rating: { average: 4.5, count: 23 },
        totalSold: 45
      },
      {
        name: 'HP LaserJet Pro M404dn Monochrome Printer',
        slug: createSlug('HP LaserJet Pro M404dn Monochrome Printer'),
        description: 'HP LaserJet Pro M404dn delivers professional-quality prints with fast printing speeds and robust security features. Ideal for busy workgroups and small businesses.',
        shortDescription: 'Professional monochrome laser printer for business',
        images: [
          { url: '/uploads/products/hp-m404dn.jpg', alt: 'HP LaserJet Pro M404dn' }
        ],
        category: printerCategory._id,
        seller: seller._id,
        price: 3850000,
        comparePrice: 4200000,
        cost: 3500000,
        sku: generateSKU('HP LaserJet Pro M404dn', 'Printers'),
        stock: 15,
        specifications: [
          { name: 'Print Technology', value: 'Laser' },
          { name: 'Print Speed', value: 'Up to 38 ppm' },
          { name: 'Connectivity', value: 'Ethernet, USB' },
          { name: 'Memory', value: '256 MB' }
        ],
        weight: 11.9,
        dimensions: { length: 376, width: 347, height: 216 },
        tags: ['hp', 'laser', 'monochrome', 'business'],
        isFeatured: true,
        rating: { average: 4.7, count: 18 },
        totalSold: 32
      },
      {
        name: 'ASUS VivoBook 14 A416JA Laptop',
        slug: createSlug('ASUS VivoBook 14 A416JA Laptop'),
        description: 'ASUS VivoBook 14 A416JA features Intel Core i3 processor, 4GB RAM, and 256GB SSD. Perfect for students and professionals who need reliable performance for daily computing tasks.',
        shortDescription: 'Affordable laptop with Intel Core i3 and SSD storage',
        images: [
          { url: '/uploads/products/asus-vivobook-14.jpg', alt: 'ASUS VivoBook 14' }
        ],
        category: computerCategory._id,
        seller: seller._id,
        price: 6750000,
        comparePrice: 7200000,
        cost: 6200000,
        sku: generateSKU('ASUS VivoBook 14', 'Computers'),
        stock: 12,
        variants: [
          {
            name: 'Color',
            options: ['Slate Grey', 'Transparent Silver', 'Indie Black']
          }
        ],
        specifications: [
          { name: 'Processor', value: 'Intel Core i3-1005G1' },
          { name: 'Memory', value: '4GB DDR4' },
          { name: 'Storage', value: '256GB SSD' },
          { name: 'Display', value: '14" FHD (1920x1080)' },
          { name: 'Graphics', value: 'Intel UHD Graphics' }
        ],
        weight: 1.6,
        dimensions: { length: 325, width: 216, height: 19.9 },
        tags: ['asus', 'laptop', 'intel', 'ssd'],
        isFeatured: true,
        rating: { average: 4.3, count: 41 },
        totalSold: 67
      },
      {
        name: 'Kingston NV2 NVMe SSD 500GB',
        slug: createSlug('Kingston NV2 NVMe SSD 500GB'),
        description: 'Kingston NV2 PCIe 4.0 NVMe SSD delivers next-level performance for gaming and high-performance computing. Upgrade your system with faster boot times and application loading.',
        shortDescription: 'High-performance NVMe SSD for faster computing',
        images: [
          { url: '/uploads/products/kingston-nv2-ssd.jpg', alt: 'Kingston NV2 SSD' }
        ],
        category: sparepartsCategory._id,
        seller: seller._id,
        price: 650000,
        comparePrice: 750000,
        cost: 580000,
        sku: generateSKU('Kingston NV2 SSD', 'Spare Parts'),
        stock: 35,
        variants: [
          {
            name: 'Capacity',
            options: ['250GB', '500GB', '1TB', '2TB']
          }
        ],
        specifications: [
          { name: 'Interface', value: 'PCIe Gen 4.0 x4 NVMe' },
          { name: 'Capacity', value: '500GB' },
          { name: 'Sequential Read', value: 'Up to 3,500 MB/s' },
          { name: 'Sequential Write', value: 'Up to 2,100 MB/s' },
          { name: 'Form Factor', value: 'M.2 2280' }
        ],
        weight: 0.007,
        dimensions: { length: 80, width: 22, height: 2.15 },
        tags: ['kingston', 'ssd', 'nvme', 'storage'],
        isFeatured: false,
        rating: { average: 4.6, count: 29 },
        totalSold: 89
      },
      {
        name: 'Logitech MX Master 3S Wireless Mouse',
        slug: createSlug('Logitech MX Master 3S Wireless Mouse'),
        description: 'Logitech MX Master 3S is the ultimate wireless mouse for productivity. Features quiet clicks, ultra-precise scrolling, and works on virtually any surface including glass.',
        shortDescription: 'Premium wireless mouse for productivity professionals',
        images: [
          { url: '/uploads/products/logitech-mx-master-3s.jpg', alt: 'Logitech MX Master 3S' }
        ],
        category: sparepartsCategory._id,
        seller: seller._id,
        price: 1450000,
        comparePrice: 1650000,
        cost: 1300000,
        sku: generateSKU('Logitech MX Master 3S', 'Spare Parts'),
        stock: 20,
        variants: [
          {
            name: 'Color',
            options: ['Graphite', 'Pale Grey', 'Rose']
          }
        ],
        specifications: [
          { name: 'Connectivity', value: 'Bluetooth, USB Receiver' },
          { name: 'Battery Life', value: 'Up to 70 days' },
          { name: 'DPI', value: '200-8000 DPI' },
          { name: 'Buttons', value: '7 buttons' },
          { name: 'Compatibility', value: 'Windows, macOS, Linux' }
        ],
        weight: 0.141,
        dimensions: { length: 124.9, width: 84.3, height: 51 },
        tags: ['logitech', 'mouse', 'wireless', 'productivity'],
        isFeatured: true,
        rating: { average: 4.8, count: 52 },
        totalSold: 78
      }
    ]);

    console.log('Created sample products');
    console.log('✅ Seed data created successfully!');
    
    console.log('\n📋 Demo Accounts:');
    console.log('Customer: customer@demo.com / password123');
    console.log('Seller: seller@demo.com / password123');
    console.log('Admin: admin@demo.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
