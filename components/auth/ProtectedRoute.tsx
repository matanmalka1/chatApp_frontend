
import React, { useEffect } from 'react';
// @ts-ignore: react-router-dom exports are incorrectly reported as missing in this environment
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import { STORAGE_KEYS } from '../../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, setAuth, logout, setLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken && !isAuthenticated) {
        try {
          const { data } = await api.post('/api/auth/refresh', { refreshToken });
          // Get user details after refresh
          const userRes = await api.get('/api/users/me');
          setAuth(userRes.data, data.accessToken, refreshToken);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;