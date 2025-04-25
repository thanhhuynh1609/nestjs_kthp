import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchProducts = async (searchTerm) => {
  try {
    const response = await api.get(`/product/search?title=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;