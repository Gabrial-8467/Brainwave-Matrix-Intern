import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTag, FaBoxOpen, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { addToCart as addToCartLocal } from '../utils/cartUtils';

const fakeProducts = [
  {
    _id: 'fake1',
    name: 'Demo T-Shirt',
    description: 'A stylish demo t-shirt for your store.',
    price: 19.99,
    image: 'https://placehold.co/300x200?text=Demo+T-Shirt',
    countInStock: 5,
  },
  {
    _id: 'fake2',
    name: 'Demo Laptop',
    description: 'A powerful demo laptop for work and play.',
    price: 899.99,
    image: 'https://placehold.co/300x200?text=Demo+Laptop',
    countInStock: 2,
  },
  {
    _id: 'fake3',
    name: 'Demo Sofa',
    description: 'A comfy demo sofa for your living room.',
    price: 299.99,
    image: 'https://placehold.co/300x200?text=Demo+Sofa',
    countInStock: 1,
  },
  {
    _id: 'fake4',
    name: 'Demo Headphones',
    description: 'High-quality demo headphones for music lovers.',
    price: 59.99,
    image: 'https://placehold.co/300x200?text=Demo+Headphones',
    countInStock: 8,
  },
  {
    _id: 'fake5',
    name: 'Demo Coffee Maker',
    description: 'Brew the perfect cup with this demo coffee maker.',
    price: 49.99,
    image: 'https://placehold.co/300x200?text=Demo+Coffee+Maker',
    countInStock: 4,
  },
  {
    _id: 'fake6',
    name: 'Demo Sneakers',
    description: 'Trendy demo sneakers for everyday comfort.',
    price: 79.99,
    image: 'https://placehold.co/300x200?text=Demo+Sneakers',
    countInStock: 10,
  },
  {
    _id: 'fake7',
    name: 'Demo Smartwatch',
    description: 'Stay connected with this demo smartwatch.',
    price: 129.99,
    image: 'https://placehold.co/300x200?text=Demo+Smartwatch',
    countInStock: 6,
  },
  {
    _id: 'fake8',
    name: 'Demo Backpack',
    description: 'A durable demo backpack for work or travel.',
    price: 39.99,
    image: 'https://placehold.co/300x200?text=Demo+Backpack',
    countInStock: 7,
  },
  {
    _id: 'fake9',
    name: 'Demo Table Lamp',
    description: 'Brighten your space with this demo table lamp.',
    price: 24.99,
    image: 'https://placehold.co/300x200?text=Demo+Lamp',
    countInStock: 12,
  },
];

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        // fallback to demo product
        setProduct(fakeProducts.find(fp => fp._id === id));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setCartLoading(true);
    setCartMessage(null);
    if (product._id.startsWith('fake')) {
      addToCartLocal(product, 1);
      setTimeout(() => {
        setCartMessage({ type: 'success', text: 'Added to cart!' });
        setCartLoading(false);
      }, 500);
      return;
    }
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      setCartMessage({ type: 'error', text: 'You must be logged in to add to cart.' });
      setCartLoading(false);
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { userId: user.id || user._id, productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartMessage({ type: 'success', text: 'Added to cart!' });
    } catch (err) {
      setCartMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add to cart.' });
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4">
      <div className="max-w-3xl w-full bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-10 items-center">
        <img
          src={product.image || 'https://placehold.co/300x200?text=No+Image'}
          alt={product.name}
          className="w-full md:w-1/2 h-72 object-cover rounded-xl shadow mb-6 md:mb-0"
        />
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <h2 className="text-3xl font-extrabold mb-2 text-gray-800">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center gap-1 text-blue-600 font-bold text-xl">
                <FaTag /> ${product.price}
              </span>
              <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <FaBoxOpen />
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
          {cartMessage && (
            <div className={`flex items-center gap-2 mb-4 mt-2 text-sm font-semibold ${cartMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {cartMessage.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
              {cartMessage.text}
            </div>
          )}
          <button
            className="mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow font-bold text-lg transition disabled:opacity-50 w-full md:w-auto"
            disabled={product.countInStock === 0 || cartLoading}
            onClick={handleAddToCart}
          >
            <FaShoppingCart />
            {cartLoading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails; 