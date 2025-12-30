
import React, { useState } from 'react';
import { Search, Settings, MoreVertical, Plus, X } from 'lucide-react';
import { Conversation } from '../types';
import Avatar from './Avatar';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeId, onSelect, onToggle }) => {
  const [search, setSearch] = useState('');

  const filteredConversations = conversations.filter(c => 
    c.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white/70 backdrop-blur-xl border-r border-slate-200 shadow-xl">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            MatanChat
          </h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden" onClick={onToggle}>
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Plus className="w-5 h-5 text-slate-500" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Settings className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search conversations..."
            className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto mt-4 px-2 space-y-1">
        {filteredConversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group ${
              activeId === conv.id 
                ? 'bg-indigo-50 shadow-sm border-indigo-100 border' 
                : 'hover:bg-slate-50/80 border border-transparent'
            }`}
          >
            <div className="relative flex-shrink-0">
              <Avatar user={conv.user} size="lg" />
              {conv.user.status === 'online' && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-center mb-0.5">
                <span className={`font-semibold truncate ${activeId === conv.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {conv.user.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {conv.lastMessageTime ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(conv.lastMessageTime) : ''}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500 truncate line-clamp-1 leading-relaxed">
                  {conv.lastMessage || 'Start a conversation'}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md shadow-indigo-200">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* User Status Bar */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <Avatar user={{ id: 'me', name: 'Alex Rivera', avatar: 'https://picsum.photos/seed/alex/200', status: 'online' }} size="sm" />
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800">Alex Rivera</p>
            <p className="text-[10px] text-emerald-600 font-medium">Active Now</p>
          </div>
          <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
