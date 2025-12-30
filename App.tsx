
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Conversation, Message, User } from './types';
import { initialConversations, initialMessages, currentUser } from './mockData';
import { getGeminiResponse } from './geminiService';

const App: React.FC = () => {
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConversations[0]?.id || null);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConvId);

  const sendMessage = useCallback(async (text: string) => {
    if (!activeConvId || !text.trim()) return;

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMessage]
    }));

    // Update last message in sidebar
    setConversations(prev => prev.map(c => 
      c.id === activeConvId 
        ? { ...c, lastMessage: text, lastMessageTime: new Date() }
        : c
    ));

    // Simple AI interaction if talking to Gemini Assistant
    if (activeConversation?.user.id === '3') {
      setIsTyping(true);
      const responseText = await getGeminiResponse(text);
      
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        senderId: '3',
        text: responseText,
        timestamp: new Date(),
        status: 'read',
        isAi: true
      };

      setMessagesMap(prev => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), aiMessage]
      }));
      
      setConversations(prev => prev.map(c => 
        c.id === activeConvId 
          ? { ...c, lastMessage: responseText, lastMessageTime: new Date() }
          : c
      ));
      setIsTyping(false);
    }
  }, [activeConvId, activeConversation]);

  // Handle mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-900">
      {/* Sidebar - Desktop & Tablet */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full w-0'
        }`}
      >
        <Sidebar 
          conversations={conversations}
          activeId={activeConvId}
          onSelect={(id) => {
            setActiveConvId(id);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
          }}
          onToggle={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col min-w-0">
        <ChatArea 
          conversation={activeConversation}
          messages={activeConvId ? (messagesMap[activeConvId] || []) : []}
          onSendMessage={sendMessage}
          isTyping={isTyping}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
      </div>
    </div>
  );
};

export default App;
