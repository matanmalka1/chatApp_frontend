
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Image } from 'lucide-react';

interface MessageComposerProps {
  onSend: (text: string) => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="flex items-end gap-3 max-w-5xl mx-auto w-full">
      <div className="flex gap-1">
        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <Paperclip className="w-5 h-5" />
        </button>
        <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all hidden sm:block">
          <Image className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 relative flex items-center bg-slate-100 rounded-2xl group focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all border border-transparent focus-within:border-indigo-200">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Type your message..."
          className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 px-4 resize-none min-h-[44px] max-h-[120px] text-slate-700 outline-none placeholder:text-slate-400 font-medium"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors">
          <Smile className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {text.trim() && (
          <button 
            onClick={handleSend}
            className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 flex items-center justify-center group"
          >
            <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageComposer;
