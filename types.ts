
export type Status = 'online' | 'offline' | 'away';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: Status;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isAi?: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}
