import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrashAlt, FaPlus, FaMinus, FaCheckCircle, FaExclamationCircle, FaTruck } from 'react-icons/fa';
import { getCart as getCartLocal, updateCartItem, removeCartItem, clearCart } from '../utils/cartUtils';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemLoading, setItemLoading] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [localCart, setLocalCart] = useState([]);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchCart = async () => {
    if (!token || !user) {
      setError('You must be logged in to view your cart.');
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(`http://localhost:5000/api/cart/${user.id || user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data);
    } catch (err) {
      setCart(null); // fallback to local cart
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    setLocalCart(getCartLocal());
    // eslint-disable-next-line
  }, []);

  // Watch for local cart changes
  useEffect(() => {
    const handleStorage = () => setLocalCart(getCartLocal());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    setItemLoading(prev => ({ ...prev, [productId]: true }));
    // Demo product: update local cart
    if (productId.startsWith('fake')) {
      updateCartItem(productId, quantity);
      setLocalCart(getCartLocal());
      setItemLoading(prev => ({ ...prev, [productId]: false }));
      return;
    }
    // Real product: update backend
    try {
      await axios.put(
        'http://localhost:5000/api/cart/update',
        { userId: user.id || user._id, productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      setError('Failed to update cart item.');
    } finally {
      setItemLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    setItemLoading(prev => ({ ...prev, [productId]: true }));
    // Demo product: remove from local cart
    if (productId.startsWith('fake')) {
      removeCartItem(productId);
      setLocalCart(getCartLocal());
      setItemLoading(prev => ({ ...prev, [productId]: false }));
      return;
    }
    // Real product: remove from backend
    try {
      await axios.delete('http://localhost:5000/api/cart/remove', {
        data: { userId: user.id || user._id, productId },
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (err) {
      setError('Failed to remove cart item.');
    } finally {
      setItemLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Use backend cart if available, else local cart
  const cartItems = cart?.items && cart.items.length > 0 ? cart.items : localCart;
  const total = cartItems.reduce((sum, item) => (item.product ? sum + (item.product.price || 0) * item.quantity : sum + (item.price || 0) * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutMessage(null);
    // Demo: if only demo products, just clear local cart
    if (cartItems.every(item => item._id && item._id.startsWith('fake'))) {
      setTimeout(() => {
        clearCart();
        setLocalCart([]);
        setCheckoutMessage({ type: 'success', text: 'Order placed (demo only)!' });
        setCheckoutLoading(false);
      }, 700);
      return;
    }
    // Real checkout
    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          userId: user.id || user._id,
          items: cartItems.map(item => ({ product: item.product?._id || item._id, quantity: item.quantity })),
          shippingAddress: shipping,
          totalPrice: total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCheckoutMessage({ type: 'success', text: 'Order placed successfully!' });
      setCart({ ...cart, items: [] });
    } catch (err) {
      setCheckoutMessage({ type: 'error', text: err.response?.data?.message || 'Failed to place order.' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 text-center text-red-600 font-semibold">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4">
      <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <FaShoppingCart className="text-3xl text-blue-600" />
          <h2 className="text-3xl font-extrabold text-gray-800">Your Cart</h2>
        </div>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Your cart is empty.</div>
        ) : (
          <div className="space-y-6">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center gap-4 bg-white rounded-xl shadow p-4 border border-gray-100">
                <img src={item.product?.image || item.image || 'https://placehold.co/300x200?text=No+Image'} alt={item.product?.name || item.name} className="w-24 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-800">{item.product?.name || item.name}</div>
                  <div className="text-blue-600 font-bold">${item.product?.price || item.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-blue-100 transition disabled:opacity-50"
                    onClick={() => handleUpdateQuantity(item.product?._id || item._id, item.quantity - 1)}
                    disabled={itemLoading[item.product?._id || item._id] || item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-3 py-1 bg-gray-50 rounded text-gray-700 font-semibold border">{item.quantity}</span>
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-blue-100 transition disabled:opacity-50"
                    onClick={() => handleUpdateQuantity(item.product?._id || item._id, item.quantity + 1)}
                    disabled={itemLoading[item.product?._id || item._id]}
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  className="ml-4 p-2 bg-red-100 hover:bg-red-200 rounded transition text-red-600 disabled:opacity-50"
                  onClick={() => handleRemoveItem(item.product?._id || item._id)}
                  disabled={itemLoading[item.product?._id || item._id]}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            <div className="flex justify-end items-center mt-8">
              <div className="text-xl font-bold text-gray-800 mr-4">Total:</div>
              <div className="text-2xl font-extrabold text-blue-600">${total.toFixed(2)}</div>
            </div>
            <button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow text-lg transition flex items-center justify-center gap-2"
              onClick={() => setShowCheckout(true)}
              disabled={showCheckout}
            >
              <FaTruck />
              Proceed to Checkout
            </button>
            {showCheckout && (
              <form onSubmit={handleCheckout} className="mt-8 bg-blue-50 rounded-xl p-6 shadow space-y-4">
                <h3 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2"><FaTruck /> Shipping Information</h3>
                {checkoutMessage && (
                  <div className={`flex items-center gap-2 mb-2 text-sm font-semibold ${checkoutMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {checkoutMessage.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {checkoutMessage.text}
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    value={shipping.address}
                    onChange={e => setShipping({ ...shipping, address: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      value={shipping.city}
                      onChange={e => setShipping({ ...shipping, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Postal Code</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      value={shipping.postalCode}
                      onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    value={shipping.country}
                    onChange={e => setShipping({ ...shipping, country: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg shadow text-lg transition flex items-center justify-center gap-2"
                  disabled={checkoutLoading}
                >
                  <FaCheckCircle />
                  {checkoutLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart; 