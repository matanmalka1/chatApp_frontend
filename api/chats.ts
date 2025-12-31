import api from './axios';
import { Chat } from '../types';

export const getChats = () => 
  api.get<Chat[]>('/api/chats');

export const createChat = (data: { 
  userIds: string[]; 
  name?: string; 
  isGroup?: boolean 
}) => 
  api.post<{ message: string; chat: Chat }>('/api/chats', data);

export const getChatById = (id: string) => 
  api.get<Chat>(`/api/chats/${id}`);

export const updateChat = (id: string, data: { name?: string; avatar?: string }) =>
  api.put<{ message: string; chat: Chat }>(`/api/chats/${id}`, data);

export const deleteChat = (id: string) => 
  api.delete<{ message: string }>(`/api/chats/${id}`);