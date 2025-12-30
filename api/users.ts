
import api from './axios';
import { User } from '../types';

export const getUsers = (params: { search?: string; page?: number; limit?: number }) => 
  api.get<{ users: User[], total: number }>('/api/users', { params });

export const getUserById = (id: string) => 
  api.get<User>(`/api/users/${id}`);

export const updateUser = (id: string, data: any) => 
  api.put<User>(`/api/users/${id}`, data);
