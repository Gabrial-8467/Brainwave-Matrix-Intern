import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaSignInAlt, FaStore, FaSignOutAlt, FaListAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50 p-0">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <FaStore className="text-2xl text-blue-600" />
          <Link to="/" className="text-xl font-extrabold text-gray-800 hover:text-blue-600 transition">Ecommerce</Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition font-medium">
            <FaShoppingCart className="text-lg" />
            <span>Cart</span>
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition font-medium">
                <FaListAlt className="text-lg" />
                <span>Orders</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition font-medium">
                <FaUserCircle className="text-lg" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition font-medium bg-transparent border-none outline-none cursor-pointer"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition font-medium">
              <FaSignInAlt className="text-lg" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 