export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  socketId?: string;
}

export interface Message {
  id: string;
  chatId: string;
  userId: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file';
  createdAt: string;
  updatedAt: string;
  isRead?: boolean;
  readBy?: string[];
}

export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  users: User[]; // שם השדה הנכון מה-Backend
  messages?: Message[];
  avatar?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}