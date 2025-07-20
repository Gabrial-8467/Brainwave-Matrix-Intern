// Get cart from localStorage
export function getCart() {
  const cart = localStorage.getItem('demo_cart');
  return cart ? JSON.parse(cart) : [];
}

// Add product to cart (if exists, increment quantity)
export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const idx = cart.findIndex(item => item._id === product._id);
  if (idx > -1) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  localStorage.setItem('demo_cart', JSON.stringify(cart));
}

// Update quantity
export function updateCartItem(productId, quantity) {
  const cart = getCart();
  const idx = cart.findIndex(item => item._id === productId);
  if (idx > -1) {
    cart[idx].quantity = quantity;
    if (cart[idx].quantity < 1) cart.splice(idx, 1);
  }
  localStorage.setItem('demo_cart', JSON.stringify(cart));
}

// Remove item
export function removeCartItem(productId) {
  const cart = getCart().filter(item => item._id !== productId);
  localStorage.setItem('demo_cart', JSON.stringify(cart));
}

// Clear cart
export function clearCart() {
  localStorage.removeItem('demo_cart');
} 