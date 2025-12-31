import { create } from 'zustand';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    // שמירת User ב-localStorage כדי שנוכל לטעון אותו מחדש
    localStorage.setItem('chat_app_user', JSON.stringify(user));
    set({ user, accessToken, isAuthenticated: true, isLoading: false });
  },

  updateUser: (updatedUser) => {
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updatedUser } : null;
      if (newUser) {
        localStorage.setItem('chat_app_user', JSON.stringify(newUser));
      }
      return { user: newUser };
    });
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem('chat_app_user');
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));