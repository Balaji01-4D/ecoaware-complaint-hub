
import apiClient from './apiClient';

export const complaintService = {
  async getMyComplaints() {
    const response = await apiClient.get('/complaints');
    return response.data;
  },

  async getComplaint(id: number) {
    const response = await apiClient.get(`/complaints/${id}`);
    return response.data;
  },

  async createComplaint(formData: FormData) {
    const response = await apiClient.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateComplaint(id: number, formData: FormData) {
    const response = await apiClient.put(`/complaints/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteComplaint(id: number) {
    await apiClient.delete(`/complaints/${id}`);
  },
};
