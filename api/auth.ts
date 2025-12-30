
import api from './axios';
import { AuthResponse } from '../types';

export const login = (credentials: any) => 
  api.post<AuthResponse>('/api/auth/login', credentials);

export const register = (userData: any) => 
  api.post<AuthResponse>('/api/auth/register', userData);

export const logout = () => 
  api.post('/api/auth/logout');

export const getMe = () => 
  api.get('/api/users/me'); // Assuming endpoint exists for profile re-fetch
