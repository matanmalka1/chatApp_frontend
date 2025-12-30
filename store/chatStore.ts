
import { create } from 'zustand';
import { Chat, Message } from '../types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  typingUsers: Record<string, string[]>; // chatId -> userIds
  setChats: (chats: Chat[]) => void;
  setActiveChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessageInList: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  setLoadingChats: (loading: boolean) => void;
  setLoadingMessages: (loading: boolean) => void;
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  messages: [],
  isLoadingChats: false,
  isLoadingMessages: false,
  typingUsers: {},

  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat, messages: [] }),
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
    // Update last message in chat list
    chats: state.chats.map(c => 
      c._id === message.chatId ? { ...c, lastMessage: message } : c
    ).sort((a, b) => {
      const aTime = new Date(a.lastMessage?.createdAt || a.createdAt).getTime();
      const bTime = new Date(b.lastMessage?.createdAt || b.createdAt).getTime();
      return bTime - aTime;
    })
  })),

  updateMessageInList: (message) => set((state) => ({
    messages: state.messages.map(m => m._id === message._id ? message : m)
  })),

  removeMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(m => m._id !== messageId)
  })),

  setLoadingChats: (loading) => set({ isLoadingChats: loading }),
  setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),

  setTyping: (chatId, userId, isTyping) => set((state) => {
    const currentTyping = state.typingUsers[chatId] || [];
    const updated = isTyping 
      ? [...new Set([...currentTyping, userId])]
      : currentTyping.filter(id => id !== userId);
    
    return {
      typingUsers: { ...state.typingUsers, [chatId]: updated }
    };
  }),
}));
