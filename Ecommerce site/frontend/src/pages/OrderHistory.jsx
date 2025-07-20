import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaListAlt, FaBoxOpen, FaDollarSign } from 'react-icons/fa';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view your order history.');
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('http://localhost:5000/api/users/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (err) {
        setError('Failed to load order history. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <FaListAlt className="text-3xl text-blue-600" />
          <h2 className="text-3xl font-extrabold text-gray-800">Order History</h2>
        </div>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-12">You have no orders yet.</div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="flex items-center gap-4 bg-white rounded-xl shadow p-4 border border-gray-100">
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-800 mb-1">Order #{order._id}</div>
                  <div className="text-gray-500 text-sm mb-1">Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-blue-600 font-bold">
                      <FaBoxOpen /> {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1 text-green-600 font-bold">
                      <FaDollarSign /> ${order.totalPrice.toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory; 