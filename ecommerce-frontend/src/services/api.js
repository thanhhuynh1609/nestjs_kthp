import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const getBanners = async () => {
  try {
    const response = await api.get('/banner');
    console.log('API getBanners response:', response.data); // Log để debug
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const createBanner = async (bannerData) => {
  const response = await api.post('/banner', bannerData);
  return response.data;
};

export const updateBanner = async (id, bannerData) => {
  const response = await api.put(`/banner/${id}`, bannerData);
  return response.data;
};

export const deleteBanner = async (id) => {
  await api.delete(`/banner/${id}`);
};

export default api;