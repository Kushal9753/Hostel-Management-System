import api from './api';

// Create a new complaint
export const createComplaint = async (complaintData) => {
  const response = await api.post('/api/complaints', complaintData);
  return response.data;
};

// Get all complaints for the logged-in student
export const getMyComplaints = async () => {
  const response = await api.get('/api/complaints/my-complaints');
  return response.data;
};

// Get all complaints (Admin only)
export const getAllComplaints = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/api/complaints?${queryString}` : '/api/complaints';
  const response = await api.get(url);
  return response.data;
};

// Update complaint status (Admin only)
export const updateComplaintStatus = async (id, statusData) => {
  const response = await api.put(`/api/complaints/${id}/status`, statusData);
  return response.data;
};

// Delete a complaint (Admin only)
export const deleteComplaint = async (id) => {
  const response = await api.delete(`/api/complaints/${id}`);
  return response.data;
};
