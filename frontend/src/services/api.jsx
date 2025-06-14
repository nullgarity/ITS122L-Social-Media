import axios from 'axios';

const api = axios.create({
  baseURL: 'https://social-backend-qz4q.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
