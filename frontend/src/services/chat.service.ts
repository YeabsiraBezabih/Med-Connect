import api from './api';
import { UserProfile } from './user.service';

export interface ChatRoom {
  id: number;
  patient: UserProfile;
  pharmacy: UserProfile;
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
}

export interface ChatMessage {
  id: number;
  room: number;
  sender: UserProfile;
  content: string;
  created_at: string;
  is_read: boolean;
}

const chatService = {
  // Get user's chat rooms
  getChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await api.get('/chat/rooms/');
    return response.data;
  },

  // Get chat room by ID
  getChatRoom: async (roomId: number): Promise<ChatRoom> => {
    const response = await api.get(`/chat/rooms/${roomId}/`);
    return response.data;
  },

  // Get messages for a chat room
  getChatMessages: async (roomId: number): Promise<ChatMessage[]> => {
    const response = await api.get(`/chat/rooms/${roomId}/messages/`);
    return response.data;
  },

  // Send a message
  sendMessage: async (roomId: number, content: string): Promise<ChatMessage> => {
    const response = await api.post(`/chat/rooms/${roomId}/messages/`, { content });
    return response.data;
  },

  // Create a new chat room
  createChatRoom: async (pharmacyId: number): Promise<ChatRoom> => {
    const response = await api.post('/chat/rooms/', { pharmacy: pharmacyId });
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/chat/unread-count/');
    return response.data.count;
  }
};

export default chatService; 