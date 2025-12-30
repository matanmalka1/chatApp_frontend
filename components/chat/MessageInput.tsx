
import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import SocketManager from '../../utils/socket';
import { useAuthStore } from '../../store/authStore';
import { sendMessage as apiSendMessage } from '../../api/messages';
import toast from 'react-hot-toast';

const MessageInput: React.FC = () => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Fixed: Changed from NodeJS.Timeout to any to avoid namespace errors in browser environment
  const typingTimeoutRef = useRef<any>(null);
  const { activeChat, addMessage } = useChatStore();
  const { accessToken, user } = useAuthStore();
  
  const socket = SocketManager.getInstance(accessToken);

  const handleTyping = () => {
    if (!socket || !activeChat) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing_start', { chatId: activeChat._id });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing_stop', { chatId: activeChat._id });
    }, 3000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || !activeChat) return;

    const content = text.trim();
    setText('');

    // Clear typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit('typing_stop', { chatId: activeChat._id });
      setIsTyping(false);
    }

    try {
      // Optimistic update could happen here
      const { data } = await apiSendMessage({
        chatId: activeChat._id,
        content,
        type: 'text'
      });
      
      // The socket might also send this message back, 
      // check logic to prevent double addition
      // Usually socket broadcasts to everyone EXCEPT sender, or we just rely on API response
      addMessage(data);
    } catch (err) {
      toast.error('Message failed to send');
      setText(content); // Restore text
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
      <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <button type="button" className="text-gray-400 hover:text-indigo-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <button type="button" className="text-gray-400 hover:text-indigo-600 ml-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none focus:ring-0 mx-2 text-sm text-gray-800 py-2"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button 
          type="submit"
          disabled={!text.trim()}
          className={`p-2 rounded-full transition-colors ${text.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-gray-300'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;