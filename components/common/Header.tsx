
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import Avatar from './Avatar';
import { logout as apiLogout } from '../../api/auth';
import toast from 'react-hot-toast';
// @ts-ignore: react-router-dom exports are incorrectly reported as missing in this environment
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiLogout();
      logout();
      toast.success('Logged out successfully');
    } catch (err) {
      logout(); // Force logout even if API fails
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </div>
        <span className="font-bold text-lg text-gray-900 tracking-tight hidden sm:block">GeminiChat<span className="text-indigo-600">Pro</span></span>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/users" className="text-gray-500 hover:text-indigo-600 font-medium text-sm">Find People</Link>
        <div className="h-6 w-px bg-gray-200"></div>
        <div className="flex items-center group relative cursor-pointer">
          <div className="text-right mr-3 hidden sm:block">
            <p className="text-xs font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-gray-400">@{user?.username}</p>
          </div>
          <Avatar src={user?.avatar} name={user?.username || 'User'} size="md" />
          
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Your Profile</Link>
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;