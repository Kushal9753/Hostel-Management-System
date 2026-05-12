import api from './api';

export const getAllRooms = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/api/rooms?${queryString}` : '/api/rooms';
  const response = await api.get(url);
  return response.data;
};

export const getVacantRooms = async () => {
  const response = await api.get('/api/rooms/vacant');
  return response.data;
};

export const addRoom = async (roomData) => {
  const response = await api.post('/api/rooms', roomData);
  return response.data;
};

export const updateRoom = async (id, roomData) => {
  const response = await api.put(`/api/rooms/${id}`, roomData);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await api.delete(`/api/rooms/${id}`);
  return response.data;
};

export const assignStudentToRoom = async (id, studentId) => {
  const response = await api.post(`/api/rooms/${id}/assign`, { studentId });
  return response.data;
};
