import api from '../utils/api';
import type { Conversation, Message } from '../utils/types';

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/conversations');
    return response.data;
  },
  createConversation: async (receiverId: string): Promise<Conversation> => {
    const response = await api.post('/conversations', { receiverId });
    return response.data;
  },
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  }
};
