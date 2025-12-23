const Product = require('../models/Product');
const Category = require('../models/Category');
const { createSlug, generateSKU, paginate } = require('../utils/helpers');

const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      seller,
      featured
    } = req.query;

    const { skip, limit: limitNum } = paginate(page, limit);
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (seller) {
      query.seller = seller;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'name sellerInfo.storeName sellerInfo.rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        hasNext: skip + limitNum < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ 
      $or: [{ _id: id }, { slug: id }],
      isActive: true 
    })
      .populate('category', 'name slug')
      .populate('seller', 'name sellerInfo.storeName sellerInfo.rating sellerInfo.storeAddress');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
      .populate('category', 'name')
      .populate('seller', 'name sellerInfo.storeName')
      .limit(8);

    res.json({
      product,
      relatedProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      category,
      price,
      comparePrice,
      cost,
      stock,
      variants,
      specifications,
      weight,
      dimensions,
      tags,
      isFeatured = false
    } = req.body;

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const slug = createSlug(name);
    const sku = generateSKU(name, categoryDoc.name);

    const images = req.files ? req.files.map(file => ({
      url: `/${file.path}`,
      alt: name
    })) : [];

    const product = new Product({
      name,
      slug,
      description,
      shortDescription,
      images,
      category,
      seller: req.user.id,
      price,
      comparePrice,
      cost,
      sku,
      stock,
      variants: variants ? JSON.parse(variants) : [],
      specifications: specifications ? JSON.parse(specifications) : [],
      weight,
      dimensions: dimensions ? JSON.parse(dimensions) : {},
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isFeatured
    });

    await product.save();
    await product.populate('category', 'name slug');
    await product.populate('seller', 'name sellerInfo.storeName');

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findOne({ 
      _id: id, 
      seller: req.user.id 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (updates.name && updates.name !== product.name) {
      updates.slug = createSlug(updates.name);
    }

    if (updates.variants) {
      updates.variants = JSON.parse(updates.variants);
    }

    if (updates.specifications) {
      updates.specifications = JSON.parse(updates.specifications);
    }

    if (updates.dimensions) {
      updates.dimensions = JSON.parse(updates.dimensions);
    }

    if (updates.tags) {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/${file.path}`,
        alt: updates.name || product.name
      }));
      updates.images = [...product.images, ...newImages];
    }

    Object.assign(product, updates);
    await product.save();

    await product.populate('category', 'name slug');
    await product.populate('seller', 'name sellerInfo.storeName');

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ 
      _id: id, 
      seller: req.user.id 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    let query = { seller: req.user.id };
    
    if (status !== 'all') {
      query.isActive = status === 'active';
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
      .populate('category', 'name')
      .populate('seller', 'name sellerInfo.storeName')
      .limit(8)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getFeaturedProducts
};
