
import apiClient from './apiClient';

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: { name: string; email: string; password: string }) {
    const response = await apiClient.post('/auth/register', {
      ...userData,
      role: 'user' // Default role for normal registration
    });
    return response.data;
  },

  async registerAdmin(userData: { name: string; email: string; password: string }) {
    const response = await apiClient.post('/auth/register', {
      ...userData,
      role: 'admin'
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
