import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view your profile.');
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        setError('Failed to load profile. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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
  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <div className="bg-blue-100 p-4 rounded-full mb-4 shadow">
          <FaUserCircle className="text-5xl text-blue-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Profile</h2>
        <div className="w-full mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold">Name:</span>
            <span className="text-gray-800 font-bold">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold">Email:</span>
            <span className="text-gray-800 font-bold">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-semibold">Role:</span>
            <span className={`font-bold ${user.isAdmin ? 'text-green-600' : 'text-blue-600'}`}>{user.isAdmin ? 'Admin' : 'Customer'}</span>
          </div>
        </div>
        <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg shadow transition text-lg">Edit Profile</button>
      </div>
    </div>
  );
}

export default Profile; 