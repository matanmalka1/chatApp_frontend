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

    socket.on('connect', () => {
      console.log('✅ Socket connected');
    });
    
    socket.on('new_message', (message) => {
      console.log('📨 New message received:', message);
      
      // אם ההודעה שייכת לצ'אט הפעיל, נוסיף אותה
      if (activeChat && message.chatId === activeChat.id) {
        addMessage(message);
      } else {
        // אחרת, נעדכן את הצ'אטים
        setChats(chats.map(c => 
          c.id === message.chatId 
            ? { ...c, messages: [message, ...(c.messages || [])] } 
            : c
        ));
      }
    });

    socket.on('user_typing', ({ chatId, user: typingUser }) => {
      console.log('⌨️ User typing:', typingUser?.username);
      if (typingUser && typingUser.id) {
        setTyping(chatId, typingUser.id, true);
      }
    });

    socket.on('user_stopped_typing', ({ chatId, userId }) => {
      console.log('⏹️ User stopped typing');
      setTyping(chatId, userId, false);
    });

    socket.on('user_online', ({ userId }) => {
      console.log('🟢 User online:', userId);
      updateUserStatus(userId, true);
    });

    socket.on('user_offline', ({ userId }) => {
      console.log('🔴 User offline:', userId);
      updateUserStatus(userId, false);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
      socket.off('user_online');
      socket.off('user_offline');
      socket.off('error');
      socket.off('disconnect');
    };
  }, [accessToken, activeChat, addMessage, setTyping, chats, setChats, updateUserStatus]);

  useEffect(() => {
    if (activeChat && accessToken) {
      const socket = SocketManager.getInstance(accessToken);
      console.log('🚪 Joining chat:', activeChat.id);
      socket.emit('join_chat', { chatId: activeChat.id });

      return () => {
        console.log('🚪 Leaving chat:', activeChat.id);
        socket.emit('leave_chat', { chatId: activeChat.id });
      };
    }
  }, [activeChat, accessToken]);
};