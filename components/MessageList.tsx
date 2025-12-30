
import React from 'react';
import { Message, User } from '../types';
import { Check, CheckCheck } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  recipient: User;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, recipient }) => {
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const renderMessages = () => {
    // Fixed: Use React.ReactElement[] instead of JSX.Element[] to avoid missing namespace error
    const elements: React.ReactElement[] = [];
    let lastDate: string | null = null;

    messages.forEach((msg, idx) => {
      const dateStr = formatDate(new Date(msg.timestamp));
      if (dateStr !== lastDate) {
        elements.push(
          <div key={`date-${msg.id}`} className="flex justify-center my-8">
            <span className="bg-white/80 border border-slate-100 px-4 py-1.5 rounded-full text-[11px] font-bold text-slate-400 uppercase tracking-wider shadow-sm backdrop-blur">
              {dateStr}
            </span>
          </div>
        );
        lastDate = dateStr;
      }

      const isMe = msg.senderId === 'me';
      elements.push(
        <div 
          key={msg.id} 
          className={`flex w-full mb-1 group ${isMe ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
            <div 
              className={`px-4 py-2.5 rounded-2xl shadow-sm relative transition-all duration-200 ${
                isMe 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none hover:shadow-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                 <span className={`text-[9px] font-medium opacity-70 ${isMe ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(msg.timestamp))}
                </span>
                {isMe && (
                  <span className="opacity-80">
                    {msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });

    return elements;
  };

  return (
    <>
      {renderMessages()}
      
      {isTyping && (
        <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white border border-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="text-[10px] ml-1 font-semibold text-slate-400 italic">Thinking...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageList;
