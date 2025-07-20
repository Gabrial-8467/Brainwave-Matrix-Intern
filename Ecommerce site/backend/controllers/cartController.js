const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    res.json(cart || { user: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 