import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await API.post('/logout');
      } catch (e) {}

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete API.defaults.headers.common['Authorization'];

      navigate('/login', { replace: true });
    };

    logout();
  }, [navigate]);

  return <p className="p-6">Logging out...</p>;
}
