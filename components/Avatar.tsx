
import React from 'react';
import { User } from '../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0 border border-white shadow-sm ring-1 ring-slate-100`}>
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-indigo-600 uppercase tracking-tighter">
          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
