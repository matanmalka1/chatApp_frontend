
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatChatTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isToday(date)) return format(date, 'p');
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
};

export const formatMessageTime = (dateString: string) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'p');
};

export const formatLastSeen = (dateString?: string) => {
  if (!dateString) return 'Offline';
  return `Last seen ${formatDistanceToNow(new Date(dateString), { addSuffix: true })}`;
};
