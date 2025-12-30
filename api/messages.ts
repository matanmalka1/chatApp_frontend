
import api from './axios';
import { Message } from '../types';

export const getMessages = (chatId: string, page: number = 1, limit: number = 50) => 
  api.get<{ messages: Message[], total: number }>(`/api/messages/${chatId}`, { 
    params: { page, limit } 
  });

export const sendMessage = (data: { chatId: string; content: string; type?: string }) => 
  api.post<Message>('/api/messages', data);

export const updateMessage = (id: string, content: string) => 
  api.put<Message>(`/api/messages/${id}`, { content });

export const deleteMessage = (id: string) => 
  api.delete(`/api/messages/${id}`);
