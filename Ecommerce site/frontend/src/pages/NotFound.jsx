import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <FaExclamationTriangle className="text-6xl text-yellow-500 mb-6" />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">Sorry, the page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow text-lg transition">
        <FaHome /> Go Home
      </Link>
    </div>
  );
}

export default NotFound; 