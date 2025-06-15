// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://supabase-socmed.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Automatically attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;