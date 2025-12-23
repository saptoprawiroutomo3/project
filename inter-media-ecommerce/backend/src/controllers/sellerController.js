const Product = require('../models/Product');
const Order = require('../models/Order');
const { generateSKU } = require('../utils/helpers');

// Get seller products
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, images } = req.body;
    
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: images || [],
      seller: req.user.id,
      sku: generateSKU()
    });
    
    await product.save();
    await product.populate('category', 'name');
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, images } = req.body;
    
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.stock = stock ? parseInt(stock) : product.stock;
    product.category = category || product.category;
    product.images = images || product.images;
    
    await product.save();
    await product.populate('category', 'name');
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller orders
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.seller': req.user.id
    })
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if seller owns any items in this order
    const hasSellerItems = order.items.some(item => 
      item.seller && item.seller.toString() === req.user.id
    );
    
    if (!hasSellerItems) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    order.status = status;
    await order.save();
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get seller dashboard stats
const getSellerStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ seller: req.user.id });
    
    const totalOrders = await Order.countDocuments({
      'items.seller': req.user.id
    });
    
    const revenue = await Order.aggregate([
      { $match: { 'items.seller': req.user.id, status: 'delivered' } },
      { $unwind: '$items' },
      { $match: { 'items.seller': req.user.id } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
    ]);
    
    const lowStockProducts = await Product.find({
      seller: req.user.id,
      stock: { $lte: 10 }
    }).limit(5);
    
    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: revenue[0]?.total || 0,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerOrders,
  updateOrderStatus,
  getSellerStats
};
