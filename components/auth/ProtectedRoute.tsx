import React, { useEffect } from 'react';
// @ts-ignore
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { STORAGE_KEYS } from '../../constants';
import { refreshToken as apiRefreshToken } from '../../api/auth';
import { getUserById } from '../../api/users';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, setAuth, logout, setLoading, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (storedRefreshToken && !isAuthenticated) {
        try {
          // קבלת Access Token חדש
          const { data: tokenData } = await apiRefreshToken(storedRefreshToken);
          
          // שמירת ה-Token החדש ב-Store
          useAuthStore.getState().setAccessToken(tokenData.accessToken);
          
          // אם יש משתמש שמור, נשתמש בו
          // אחרת, נצטרך לקבל את הפרטים מה-token (decoded)
          // כרגע נשתמש במשתמש שכבר שמור
          if (!user) {
            // אם אין user, צריך לטעון אותו מאיפשהו
            // הבעיה: אין /api/users/me ב-Backend
            // פתרון זמני: נשמור את ה-user ב-localStorage
            const savedUser = localStorage.getItem('chat_app_user');
            if (savedUser) {
              const userData = JSON.parse(savedUser);
              setAuth(userData, tokenData.accessToken, storedRefreshToken);
            } else {
              logout();
            }
          } else {
            setAuth(user, tokenData.accessToken, storedRefreshToken);
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
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