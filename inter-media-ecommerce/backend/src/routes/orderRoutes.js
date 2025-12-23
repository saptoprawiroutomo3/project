const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  updatePaymentStatus
} = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/payment', updatePaymentStatus);

module.exports = router;
