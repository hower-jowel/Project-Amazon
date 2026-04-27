const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, updateOrderToPaid } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// NEW: Update order to paid
router.put('/:id/pay', protect, updateOrderToPaid);

module.exports = router;