const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { paginate } = require('../utils/helpers');

const router = express.Router();

router.use(auth, authorize('seller'));

// Seller dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const sellerId = req.user.id;

    const totalProducts = await Product.countDocuments({ 
      seller: sellerId, 
      isActive: true 
    });

    const totalOrders = await Order.countDocuments({
      'items.seller': sellerId
    });

    const totalRevenue = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 
        'items.seller': sellerId,
        paymentStatus: 'paid'
      }},
      { $group: { 
        _id: null, 
        total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }}
    ]);

    const pendingOrders = await Order.countDocuments({
      'items.seller': sellerId,
      'items.status': 'pending'
    });

    const recentOrders = await Order.find({
      'items.seller': sellerId
    })
      .populate('customer', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const topProducts = await Product.find({
      seller: sellerId,
      isActive: true
    })
      .sort({ totalSold: -1 })
      .limit(5);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders
      },
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller orders
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    let query = { 'items.seller': req.user.id };
    if (status) {
      query['items.status'] = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalOrders: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:orderId/items/:itemIndex/status', async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const { status, trackingNumber, shippingService } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const item = order.items[itemIndex];
    if (!item || item.seller.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    item.status = status;
    
    if (status === 'shipped') {
      order.trackingNumber = trackingNumber;
      order.shippingService = shippingService;
      order.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }

    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller profile
router.get('/profile', async (req, res) => {
  try {
    const seller = await User.findById(req.user.id).select('-password -otp');
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update seller profile
router.put('/profile', async (req, res) => {
  try {
    const {
      name,
      phone,
      sellerInfo
    } = req.body;

    const seller = await User.findById(req.user.id);

    seller.name = name || seller.name;
    seller.phone = phone || seller.phone;

    if (sellerInfo) {
      seller.sellerInfo = {
        ...seller.sellerInfo,
        ...sellerInfo
      };
    }

    await seller.save();

    const updatedSeller = await User.findById(req.user.id).select('-password -otp');
    res.json(updatedSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sales analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = new Date();
    if (period === '7d') {
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (period === '30d') {
      dateFilter.setDate(dateFilter.getDate() - 30);
    } else if (period === '90d') {
      dateFilter.setDate(dateFilter.getDate() - 90);
    }

    const salesData = await Order.aggregate([
      { $unwind: '$items' },
      { $match: {
        'items.seller': req.user.id,
        paymentStatus: 'paid',
        createdAt: { $gte: dateFilter }
      }},
      { $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orders: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $match: {
        'items.seller': req.user.id,
        paymentStatus: 'paid',
        createdAt: { $gte: dateFilter }
      }},
      { $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    await Product.populate(topProducts, { path: '_id', select: 'name images' });

    res.json({
      salesData,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
