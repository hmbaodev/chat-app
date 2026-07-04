import api from '../utils/api';
import type { ChatUser } from '../utils/types';

export const userService = {
  syncUser: async () => {
    const response = await api.post('/users/sync');
    return response.data;
  },
  searchUsers: async (query: string): Promise<ChatUser[]> => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  }
};
