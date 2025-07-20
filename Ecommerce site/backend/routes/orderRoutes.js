const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.createOrder);
router.get('/user/:userId', protect, orderController.getUserOrders);
router.get('/', protect, admin, orderController.getAllOrders);

module.exports = router; 