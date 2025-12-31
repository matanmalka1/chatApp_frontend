import React, { useState } from 'react';
import { Message } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { formatMessageTime } from '../../utils/formatDate';
import Avatar from '../common/Avatar';
import { deleteMessage, updateMessage } from '../../api/messages';
import { useChatStore } from '../../store/chatStore';
import toast from 'react-hot-toast';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { user } = useAuthStore();
  const { removeMessage, updateMessageInList } = useChatStore();
  const isMe = message.sender.id === user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleDelete = async () => {
    try {
      await deleteMessage(message.id);
      removeMessage(message.id);
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === message.content) {
      setIsEditing(false);
      return;
    }
    try {
      const { data } = await updateMessage(message.id, editContent);
      updateMessageInList(data.data);
      setIsEditing(false);
      toast.success('Message updated');
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  return (
    <div className={`flex items-end mb-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMe && (
        <Avatar 
          src={message.sender.avatar} 
          name={message.sender.username} 
          size="sm" 
          className="mb-1 mr-2"
        />
      )}
      <div className={`flex flex-col max-w-[70%] sm:max-w-[60%] ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <span className="text-[10px] text-gray-500 mb-1 ml-1 font-medium">
            {message.sender.username}
          </span>
        )}
        <div className="relative group">
          <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
            isMe 
              ? 'bg-indigo-600 text-white rounded-br-none' 
              : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
          }`}>
            {isEditing ? (
              <div className="flex flex-col space-y-2">
                <textarea
                  className="bg-indigo-500 text-white border-none focus:ring-0 resize-none rounded p-1 w-full"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleUpdate()}
                />
                <div className="flex justify-end space-x-2 text-[10px]">
                  <button onClick={() => setIsEditing(false)} className="underline">Cancel</button>
                  <button onClick={handleUpdate} className="font-bold underline">Save</button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}
            <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
              {formatMessageTime(message.createdAt)}
            </div>
          </div>

          {isMe && !isEditing && (
            <div className="absolute top-0 right-full mr-2 hidden group-hover:flex space-x-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:text-indigo-600 transition-colors"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;