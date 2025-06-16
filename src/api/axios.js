// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://supabase-socmed.vercel.app',
});

// Automatically attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set JSON header if not uploading files
  if (
    !(config.headers['Content-Type']) &&
    !(config.data instanceof FormData)
  ) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export default api;