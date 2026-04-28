import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getNotes = async () => {
  const response = await axios.get(`${API_URL}/notes`);
  return response.data;
};

export const uploadNote = async (formData) => {
  const response = await axios.post(`${API_URL}/notes`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axios.delete(`${API_URL}/notes/${id}`);
  return response.data;
};

export const incrementDownload = async (id) => {
  const response = await axios.patch(`${API_URL}/notes/${id}/download`);
  return response.data;
};
