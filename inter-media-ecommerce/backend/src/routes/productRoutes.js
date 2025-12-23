const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getFeaturedProducts
} = require('../controllers/productController');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', optionalAuth, getProduct);

// Seller routes
router.get('/seller/my-products', auth, authorize('seller'), getSellerProducts);
router.post('/', auth, authorize('seller'), upload.array('productImages', 5), createProduct);
router.put('/:id', auth, authorize('seller'), upload.array('productImages', 5), updateProduct);
router.delete('/:id', auth, authorize('seller'), deleteProduct);

module.exports = router;
