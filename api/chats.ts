
import api from './axios';
import { Chat } from '../types';

export const getChats = () => 
  api.get<Chat[]>('/api/chats');

export const createChat = (data: { participants: string[]; name?: string; isGroup?: boolean }) => 
  api.post<Chat>('/api/chats', data);

export const getChatById = (id: string) => 
  api.get<Chat>(`/api/chats/${id}`);

export const deleteChat = (id: string) => 
  api.delete(`/api/chats/${id}`);
