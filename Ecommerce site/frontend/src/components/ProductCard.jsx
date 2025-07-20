import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTag, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import { addToCart as addToCartLocal } from '../utils/cartUtils';

function ProductCard({ product }) {
  const [cartMsg, setCartMsg] = useState('');

  const handleAddToCart = async () => {
    if (product._id.startsWith('fake')) {
      addToCartLocal(product, 1);
      setCartMsg('Added to cart!');
      setTimeout(() => setCartMsg(''), 1200);
      return;
    }
    // For real products, you could implement backend logic here if needed
    setCartMsg('Add to cart only works for demo products here.');
    setTimeout(() => setCartMsg(''), 1200);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col border border-gray-100 hover:border-blue-200 group h-full">
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={product.image || 'https://placehold.co/300x200?text=No+Image'}
          alt={product.name}
          className="h-48 w-full object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
        />
      </Link>
      <h3 className="text-lg font-semibold mb-1 text-gray-800 group-hover:text-blue-600 transition">{product.name}</h3>
      <div className="flex items-center justify-between mt-2 mb-4">
        <span className="flex items-center gap-1 text-blue-600 font-bold text-lg">
          <FaTag className="inline-block" />
          ${product.price}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
      <div className="flex gap-2 mt-auto">
        <Link
          to={`/product/${product._id}`}
          className="flex-1 bg-gray-100 hover:bg-blue-100 text-blue-600 font-semibold px-3 py-2 rounded-lg transition text-center"
        >
          View Details
        </Link>
        <button
          className={`flex items-center justify-center px-3 py-2 rounded-lg transition ${product.countInStock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          disabled={product.countInStock === 0}
          title={product.countInStock === 0 ? 'Out of stock' : 'Add to Cart'}
          onClick={handleAddToCart}
        >
          <FaShoppingCart />
        </button>
      </div>
      {cartMsg && (
        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-semibold justify-center">
          <FaCheckCircle /> {cartMsg}
        </div>
      )}
    </div>
  );
}

export default ProductCard; 