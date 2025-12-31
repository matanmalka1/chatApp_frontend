import api from './axios';
import { AuthResponse } from '../types';

export const login = (credentials: { email: string; password: string }) => 
  api.post<AuthResponse>('/api/auth/login', credentials);

export const register = (userData: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => 
  api.post<AuthResponse>('/api/auth/register', userData);

export const logout = (refreshToken?: string) => 
  api.post('/api/auth/logout', { refreshToken });

export const refreshToken = (refreshToken: string) =>
  api.post('/api/auth/refresh', { refreshToken });