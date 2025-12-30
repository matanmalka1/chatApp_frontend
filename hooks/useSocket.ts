
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';
import SocketManager from '../utils/socket';

export const useSocket = () => {
  const { accessToken, user } = useAuthStore();
  const { activeChat, addMessage, setTyping, chats, setChats } = useChatStore();
  const { updateUserStatus } = useUserStore();

  useEffect(() => {
    if (!accessToken) return;

    const socket = SocketManager.getInstance(accessToken);

    socket.on('connect', () => console.log('Socket connected'));
    
    socket.on('new_message', (message) => {
      // If the message belongs to active chat, add it
      if (activeChat && message.chatId === activeChat._id) {
        addMessage(message);
      } else {
        // Increment unread count for other chats
        setChats(chats.map(c => 
          c._id === message.chatId 
            ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: message } 
            : c
        ));
      }
    });

    socket.on('user_typing', ({ chatId, userId }) => {
      setTyping(chatId, userId, true);
    });

    socket.on('user_stopped_typing', ({ chatId, userId }) => {
      setTyping(chatId, userId, false);
    });

    socket.on('user_online', (userId) => {
      updateUserStatus(userId, true);
    });

    socket.on('user_offline', (userId) => {
      updateUserStatus(userId, false);
    });

    return () => {
      socket.off('connect');
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [accessToken, activeChat, addMessage, setTyping, chats, setChats, updateUserStatus]);

  useEffect(() => {
    if (activeChat && accessToken) {
      const socket = SocketManager.getInstance(accessToken);
      socket.emit('join_chat', { chatId: activeChat._id });

      return () => {
        socket.emit('leave_chat', { chatId: activeChat._id });
      };
    }
  }, [activeChat, accessToken]);
};
