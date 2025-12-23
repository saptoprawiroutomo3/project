const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { generateOrderNumber, paginate } = require('../utils/helpers');
const { sendOrderConfirmation } = require('../utils/email');

const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let subtotal = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      const product = await Product.findById(item.productId).populate('seller');
      
      if (!product || !product.isActive) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        seller: product.seller._id,
        quantity: item.quantity,
        price: product.price,
        variant: item.variant
      });

      // Update product stock
      product.stock -= item.quantity;
      product.totalSold += item.quantity;
      await product.save();
    }

    const shippingCost = 15000; // Fixed shipping cost
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingCost + tax;

    const order = new Order({
      orderNumber: generateOrderNumber(),
      customer: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      notes
    });

    await order.save();
    await order.populate('items.product', 'name images');
    await order.populate('items.seller', 'name sellerInfo.storeName');

    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] }
    );

    // Send order confirmation email (simulated)
    console.log(`Order confirmation for ${req.user.email}: ${order.orderNumber}`);
    // await sendOrderConfirmation(req.user.email, order);

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    let query = { customer: req.user.id };
    
    if (status) {
      query['items.status'] = status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name images')
      .populate('items.seller', 'name sellerInfo.storeName')
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
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      $or: [{ _id: id }, { orderNumber: id }],
      customer: req.user.id
    })
      .populate('items.product', 'name images')
      .populate('items.seller', 'name sellerInfo.storeName sellerInfo.storePhone')
      .populate('customer', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: id,
      customer: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ 
        message: 'Cannot cancel paid order. Please contact support.' 
      });
    }

    // Restore product stock
    for (const item of order.items) {
      if (item.status !== 'cancelled') {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          product.totalSold -= item.quantity;
          await product.save();
        }
      }
    }

    order.items.forEach(item => {
      item.status = 'cancelled';
    });
    order.cancelledAt = new Date();
    order.cancelReason = reason;

    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentProof } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === 'paid') {
      order.items.forEach(item => {
        if (item.status === 'pending') {
          item.status = 'confirmed';
        }
      });
    }

    await order.save();

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  updatePaymentStatus
};
