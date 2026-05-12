import api from './api';

export const getStudents = async (params) => {
  const response = await api.get('/api/students', { params });
  return response.data;
};

export const getStudentDetails = async (id) => {
  const response = await api.get(`/api/students/${id}`);
  return response.data;
};

export const updateStudent = async (id, data) => {
  const response = await api.put(`/api/students/${id}`, data);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/api/students/${id}`);
  return response.data;
};
