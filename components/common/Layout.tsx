
import React from 'react';
import Header from './Header';
import { useSocket } from '../../hooks/useSocket';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useSocket(); // Initialize real-time listeners

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gray-50">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
