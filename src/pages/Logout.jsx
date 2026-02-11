import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';

export default function Logout() {
  const navigate = useNavigate();
  const hasRun = useRef(false); // prevents double execution

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleLogout = async () => {
      const confirmed = window.confirm("Are you sure you want to log out?");

      // ❌ Cancel logout
      if (!confirmed) {
        navigate(-1);
        return;
      }

      try {
        await API.post('/logout');
      } catch (e) {
        // Ignore backend logout failure
      }

      // ✅ Clear authentication
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete API.defaults.headers.common['Authorization'];

      // ✅ Force redirect (prevents dashboard flash)
      window.location.href = '/login';
    };

    handleLogout();
  }, [navigate]);

  return <p className="p-6">Logging out...</p>;
}
