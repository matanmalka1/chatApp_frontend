import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import ChatList from '../components/chat/ChatList';
import ChatRoom from '../components/chat/ChatRoom';
import { getChats, createChat } from '../api/chats';
import { useChatStore } from '../store/chatStore';
import toast from 'react-hot-toast';
import { getUsers } from '../api/users';
import { User } from '../types';
import Avatar from '../components/common/Avatar';

const ChatsPage: React.FC = () => {
  const { setChats, setLoadingChats, chats, activeChat, setActiveChat } = useChatStore();
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [search, setSearch] = useState('');
  const [foundUsers, setFoundUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        const { data } = await getChats();
        setChats(data);
      } catch (err) {
        toast.error('Failed to load conversations');
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, [setChats, setLoadingChats]);

  const handleSearchUsers = async (q: string) => {
    setSearch(q);
    if (q.length > 2) {
      try {
        const { data } = await getUsers({ search: q, limit: 5 });
        setFoundUsers(data.users);
      } catch (err) {
        console.error('Failed to search users:', err);
      }
    } else {
      setFoundUsers([]);
    }
  };

  const handleStartChat = async (targetUser: User) => {
    // שימוש ב-users במקום participants
    const existing = chats.find(c => !c.isGroup && c.users.some(p => p.id === targetUser.id));
    if (existing) {
      setActiveChat(existing);
      setShowNewChatModal(false);
      return;
    }

    try {
      // שימוש ב-userIds במקום participants
      const { data } = await createChat({ userIds: [targetUser.id], isGroup: false });
      setChats([data.chat, ...chats]);
      setActiveChat(data.chat);
      setShowNewChatModal(false);
      toast.success('Chat started!');
    } catch (err: any) {
      console.error('Failed to start chat:', err);
      toast.error(err.response?.data?.error || 'Failed to start chat');
    }
  };

  return (
    <Layout>
      {/* Sidebar */}
      <aside className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col shrink-0 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Chats</h1>
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        
        <ChatList />
      </aside>

      {/* Main Area */}
      <ChatRoom />

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">New Chat</h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <input
                type="text"
                placeholder="Search by username or email..."
                className="w-full bg-gray-50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                value={search}
                onChange={(e) => handleSearchUsers(e.target.value)}
                autoFocus
              />
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {foundUsers.map(u => (
                  <div 
                    key={u.id} 
                    onClick={() => handleStartChat(u)}
                    className="flex items-center p-3 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors"
                  >
                    <Avatar src={u.avatar} name={u.username} size="md" isOnline={u.isOnline} />
                    <div className="ml-3">
                      <p className="text-sm font-bold text-gray-900">{u.username}</p>
                      <p className="text-[10px] text-gray-500">{u.email}</p>
                    </div>
                  </div>
                ))}
                {search.length > 2 && foundUsers.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-4">No users found</p>
                )}
                {search.length <= 2 && (
                  <p className="text-center text-gray-400 text-xs py-4">Type at least 3 characters to search</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ChatsPage;