import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';
import Loader from './components/Loader';
import Toast from './components/Toast';
import Footer from './components/Footer';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  // Example global loader and toast state (can be lifted to context for full app-wide use)
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Example: setLoading(true) before async actions, setLoading(false) after
  // Example: setToast({ message: 'Success!', type: 'success' }) to show toast

  return (
    <Router>
      <Navbar />
      {loading && <Loader />}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: '' })}
      />
      <div className="min-h-screen flex flex-col justify-start">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
