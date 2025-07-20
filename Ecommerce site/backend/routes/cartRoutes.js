const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:userId', protect, cartController.getCartByUser);
router.post('/add', protect, cartController.addItemToCart);
router.put('/update', protect, cartController.updateCartItem);
router.delete('/remove', protect, cartController.removeCartItem);

module.exports = router; 