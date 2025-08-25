import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const AuthAPI = {
  async login(credentials) {
    const { data } = await apiClient.post('/login', credentials); // <-- FIXED
    return data;
  },
};


export const UsersAPI = {
  list: (params) => apiClient.get('/users', { params }).then(r => r.data),
  create: (payload) => apiClient.post('/users', payload).then(r => r.data),
  update: (id, payload) => apiClient.put(`/users/${id}`, payload).then(r => r.data),
  remove: (id) => apiClient.delete(`/users/${id}`).then(r => r.data),
};

export const AgentsAPI = {
  list: (params) => apiClient.get('/agents', { params }).then(r => r.data),
};

export const AlertsAPI = {
  list: (params) => apiClient.get('/alerts', { params }).then(r => r.data),
};


