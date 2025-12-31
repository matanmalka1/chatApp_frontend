import React from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../common/Avatar';
import { formatChatTime } from '../../utils/formatDate';

const ChatList: React.FC = () => {
  const { chats, activeChat, setActiveChat, isLoadingChats } = useChatStore();
  const { user } = useAuthStore();

  if (isLoadingChats) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse flex items-center space-x-3">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
        <p>No chats yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {chats.map((chat) => {
        // שימוש ב-users במקום participants
        const otherParticipant = chat.users.find(p => p.id !== user?.id);
        const name = chat.isGroup ? (chat.name || 'Group Chat') : (otherParticipant?.username || 'Unknown User');
        const isActive = activeChat?.id === chat.id;
        const lastMessage = chat.messages?.[0];

        return (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className={`flex items-center p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-100 ${
              isActive ? 'bg-indigo-50 border-r-4 border-indigo-500' : ''
            }`}
          >
            <Avatar 
              src={chat.isGroup ? chat.avatar : otherParticipant?.avatar} 
              name={name} 
              size="md" 
              isOnline={!chat.isGroup ? otherParticipant?.isOnline : undefined}
            />
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline">
                <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {name}
                </h3>
                {lastMessage && (
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {formatChatTime(lastMessage.createdAt)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {lastMessage ? lastMessage.content : 'No messages yet'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;