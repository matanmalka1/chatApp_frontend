
import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import { getUsers } from '../api/users';
import { createChat, getChats } from '../api/chats';
import { User } from '../types';
import Avatar from '../components/common/Avatar';
import { useChatStore } from '../store/chatStore';
// @ts-ignore: react-router-dom exports are incorrectly reported as missing in this environment
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { setActiveChat, setChats, chats } = useChatStore();
  const navigate = useNavigate();

  const fetchUsers = async (query: string = '') => {
    setLoading(true);
    try {
      const { data } = await getUsers({ search: query, limit: 50 });
      setUsers(data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleStartChat = async (targetUser: User) => {
    // Check if chat already exists in store
    const existing = chats.find(c => !c.isGroup && c.participants.some(p => p._id === targetUser._id));
    if (existing) {
      setActiveChat(existing);
      navigate('/');
      return;
    }

    try {
      const { data } = await createChat({ participants: [targetUser._id] });
      setChats([data, ...chats]);
      setActiveChat(data);
      navigate('/');
    } catch (err) {
      toast.error('Failed to start chat');
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discover People</h1>
              <p className="text-gray-500 text-sm">Find friends and start new conversations</p>
            </div>
            
            <form onSubmit={handleSearch} className="relative flex-shrink-0 w-full md:w-80">
              <input
                type="text"
                placeholder="Search by name or username..."
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {users.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-white inline-block p-6 rounded-full shadow-sm mb-4">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">No users found</h3>
                  <p className="text-gray-500">Try searching for someone else</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map(u => (
                    <div 
                      key={u._id} 
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar src={u.avatar} name={u.username} size="lg" isOnline={u.isOnline} />
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-gray-900 truncate">{u.firstName} {u.lastName}</h3>
                          <p className="text-xs text-indigo-600 font-medium truncate">@{u.username}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleStartChat(u)}
                        className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Message</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UsersPage;