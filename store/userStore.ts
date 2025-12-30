
import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  users: User[];
  onlineUsers: string[]; // User IDs
  setUsers: (users: User[]) => void;
  setOnlineUsers: (userIds: string[]) => void;
  updateUserStatus: (userId: string, isOnline: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  onlineUsers: [],
  setUsers: (users) => set({ users }),
  setOnlineUsers: (userIds) => set({ onlineUsers: userIds }),
  updateUserStatus: (userId, isOnline) => set((state) => ({
    onlineUsers: isOnline 
      ? [...new Set([...state.onlineUsers, userId])]
      : state.onlineUsers.filter(id => id !== userId),
    users: state.users.map(u => u._id === userId ? { ...u, isOnline } : u)
  }))
}));
