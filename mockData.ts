
import { User, Conversation, Message } from './types';

export const currentUser: User = {
  id: 'me',
  name: 'Alex Rivera',
  avatar: 'https://picsum.photos/seed/alex/200',
  status: 'online'
};

export const mockUsers: User[] = [
  { id: '1', name: 'Sarah Wilson', avatar: 'https://picsum.photos/seed/sarah/200', status: 'online' },
  { id: '2', name: 'James Chen', avatar: 'https://picsum.photos/seed/james/200', status: 'away', lastSeen: '5m ago' },
  { id: '3', name: 'Gemini Assistant', avatar: 'https://picsum.photos/seed/ai/200', status: 'online' },
  { id: '4', name: 'Elena Rodriguez', avatar: 'https://picsum.photos/seed/elena/200', status: 'offline', lastSeen: '2h ago' },
  { id: '5', name: 'Tech Support', avatar: 'https://picsum.photos/seed/tech/200', status: 'online' },
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv_1',
    user: mockUsers[0],
    lastMessage: 'The presentation looks great! Thanks for the updates.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 2
  },
  {
    id: 'conv_2',
    user: mockUsers[1],
    lastMessage: 'Are we meeting at 3 PM today?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0
  },
  {
    id: 'conv_3',
    user: mockUsers[2],
    lastMessage: 'I can help you with that research project.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0
  }
];

export const initialMessages: Record<string, Message[]> = {
  'conv_1': [
    { id: 'm1', senderId: '1', text: 'Hey Alex, how are you?', timestamp: new Date(Date.now() - 1000 * 60 * 30), status: 'read' },
    { id: 'm2', senderId: 'me', text: 'Doing well! Just finished the prototype.', timestamp: new Date(Date.now() - 1000 * 60 * 25), status: 'read' },
    { id: 'm3', senderId: '1', text: 'The presentation looks great! Thanks for the updates.', timestamp: new Date(Date.now() - 1000 * 60 * 15), status: 'read' },
  ],
  'conv_2': [
    { id: 'm4', senderId: '2', text: 'Are we meeting at 3 PM today?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: 'read' },
  ]
};
