import api from './axios';
import { Message } from '../types';

interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  totalPages: number;
}

export const getMessages = (chatId: string, page: number = 1, limit: number = 50) => 
  api.get<MessagesResponse>(`/api/messages/${chatId}`, { 
    params: { page, limit } 
  });

export const sendMessage = (data: { chatId: string; content: string; type?: string }) => 
  api.post<{ message: string; data: Message }>('/api/messages', data);

export const updateMessage = (id: string, content: string) => 
  api.put<{ message: string; data: Message }>(`/api/messages/${id}`, { content });

export const deleteMessage = (id: string) => 
  api.delete<{ message: string }>(`/api/messages/${id}`);