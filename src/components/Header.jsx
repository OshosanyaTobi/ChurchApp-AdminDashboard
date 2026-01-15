import React from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';

const Header = ({ category, title }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: logout on backend
      await API.post('/logout');
    } catch (e) {
      // ignore backend errors
    }

    // Clear frontend auth
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 🔴 IMPORTANT: remove auth header
    delete API.defaults.headers.common['Authorization'];

    // Redirect to login
    navigate('/login', { replace: true });
  };

  return (
    <div className="mb-10 flex items-center justify-between">
      <div>
        <p className="text-lg text-gray-400">{category}</p>
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="text-red-600 font-semibold hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
