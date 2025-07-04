
import apiClient from './apiClient';

export const adminService = {
  async getAllComplaints() {
    const response = await apiClient.get('/admin/complaints');
    return response.data;
  },

  async updateComplaintStatus(id: number, status: string) {
    const response = await apiClient.put(`/admin/complaints/${id}/status`, { status });
    return response.data;
  },
};
