
import React, { useRef, useEffect } from 'react';
import { Phone, Video, Info, Menu, ChevronLeft } from 'lucide-react';
import { Conversation, Message } from '../types';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import Avatar from './Avatar';

interface ChatAreaProps {
  conversation?: Conversation;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  onOpenSidebar: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ conversation, messages, onSendMessage, isTyping, onOpenSidebar }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          <ChevronLeft className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-600 mb-2">Select a conversation</h3>
        <p className="max-w-xs text-sm">Choose one of your contacts from the sidebar to start messaging.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header */}
      <header className="sticky top-0 z-10 h-20 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={onOpenSidebar}
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="relative group cursor-pointer">
            <Avatar user={conversation.user} size="lg" />
            <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
              conversation.user.status === 'online' ? 'bg-emerald-500' : 
              conversation.user.status === 'away' ? 'bg-amber-400' : 'bg-slate-300'
            }`}></span>
          </div>
          
          <div className="min-w-0">
            <h2 className="font-bold text-slate-800 truncate leading-none mb-1 text-lg">{conversation.user.name}</h2>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              {conversation.user.status === 'online' ? (
                <>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Online now
                </>
              ) : conversation.user.lastSeen ? `Last seen ${conversation.user.lastSeen}` : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 scroll-smooth bg-slate-50/30">
        <MessageList messages={messages} isTyping={isTyping} recipient={conversation.user} />
      </div>

      {/* Composer */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-100">
        <MessageComposer onSend={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
