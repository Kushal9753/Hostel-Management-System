import api from './api';

export const getMyLeaves = async () => {
  const response = await api.get('/api/leaves/my-leaves');
  return response.data;
};

export const createLeaveRequest = async (leaveData) => {
  const response = await api.post('/api/leaves', leaveData);
  return response.data;
};

export const getAllLeaves = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/api/leaves?${queryString}` : '/api/leaves';
  const response = await api.get(url);
  return response.data;
};

export const updateLeaveStatus = async (id, statusData) => {
  const response = await api.put(`/api/leaves/${id}/status`, statusData);
  return response.data;
};
