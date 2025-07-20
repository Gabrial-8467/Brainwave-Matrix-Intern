import ProductList from '../components/ProductList';
import { FaShoppingBag } from 'react-icons/fa';

function Home() {
  // Scroll to products grid
  const handleShopNow = () => {
    const grid = document.getElementById('product-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-r from-blue-200 via-blue-100 to-white">
        <div className="flex items-center justify-center mb-4">
          <FaShoppingBag className="text-5xl text-blue-600 drop-shadow" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 drop-shadow">Welcome to Your Dream Store</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover the best products at unbeatable prices. Shop the latest trends, enjoy fast delivery, and experience seamless shopping with us!
        </p>
        <button
          onClick={handleShopNow}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow text-lg transition flex items-center gap-2"
        >
          <FaShoppingBag /> Shop Now
        </button>
      </div>
      {/* Product Grid */}
      <div id="product-grid" className="pt-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Featured Products</h2>
        <ProductList />
      </div>
    </div>
  );
}

export default Home; 