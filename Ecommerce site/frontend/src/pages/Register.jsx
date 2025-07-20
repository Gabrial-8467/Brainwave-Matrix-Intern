import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full mb-2 shadow">
            <FaUserPlus className="text-4xl text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm">Sign up to start shopping!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="mb-2 text-red-500 text-center font-medium">{error}</div>}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg shadow transition disabled:opacity-50"
            disabled={loading}
          >
            <FaUserPlus />
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register; 