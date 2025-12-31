import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { getMessages } from '../../api/messages';
import Avatar from '../common/Avatar';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { formatLastSeen } from '../../utils/formatDate';

const ChatRoom: React.FC = () => {
  const { activeChat, messages, setMessages, setLoadingMessages, isLoadingMessages, typingUsers } = useChatStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data } = await getMessages(activeChat.id, 1, 50);
        setMessages(data.messages);
        setHasMore(data.messages.length < data.total);
        setPage(1);
        setTimeout(() => scrollToBottom('auto'), 100);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChat, setMessages, setLoadingMessages]);

  const handleLoadMore = async () => {
    if (!activeChat || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const { data } = await getMessages(activeChat.id, nextPage, 50);
      setMessages([...data.messages, ...messages]);
      setHasMore(messages.length + data.messages.length < data.total);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to fetch more messages');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && page === 1) {
      scrollToBottom();
    }
  }, [messages, page]);

  if (!activeChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 flex-col space-y-4">
        <div className="p-6 bg-white rounded-full shadow-sm">
          <svg className="w-16 h-16 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Your Messages</h2>
          <p className="text-gray-500 max-w-xs mt-2">Select a conversation from the sidebar to start chatting or create a new one.</p>
        </div>
      </div>
    );
  }

  const otherParticipant = activeChat.users.find(p => p.id !== user?.id);
  const chatName = activeChat.isGroup ? (activeChat.name || 'Group Chat') : (otherParticipant?.username || 'Chat');
  const typing = typingUsers[activeChat.id] || [];

  return (
    <div className="flex flex-col flex-1 h-full bg-white md:bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 z-10 shadow-sm">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-4 text-gray-500 hover:text-indigo-600" 
            onClick={() => useChatStore.getState().setActiveChat(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <Avatar 
            src={activeChat.isGroup ? activeChat.avatar : otherParticipant?.avatar} 
            name={chatName} 
            size="md"
            isOnline={!activeChat.isGroup ? otherParticipant?.isOnline : undefined}
          />
          <div className="ml-3">
            <h2 className="text-sm font-bold text-gray-900 leading-tight">{chatName}</h2>
            <p className="text-[10px] text-gray-400 font-medium">
              {!activeChat.isGroup && otherParticipant?.isOnline ? 'Active now' : formatLastSeen(otherParticipant?.lastSeen)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-indigo-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <button className="text-gray-400 hover:text-indigo-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-2 flex flex-col">
        {isLoadingMessages && page === 1 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="flex justify-center mb-4">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full transition-all disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load previous messages'}
                </button>
              </div>
            )}
            
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400 py-10">
                <p>Wave hello! No messages here yet.</p>
              </div>
            )}
            
            <div className="flex-1 flex flex-col">
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}
            </div>

            {typing.length > 0 && (
              <div className="flex items-center space-x-2 animate-pulse mb-2 ml-1">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-[10px] text-gray-400 italic">Someone is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} className="h-0" />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default ChatRoom;