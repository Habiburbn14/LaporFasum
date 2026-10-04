import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
};

export const laporanAPI = {
  create: (data) => api.post('/laporan/create', data),
  list: (filters) => api.get('/laporan/list', { params: filters }),
  getById: (id) => api.get(`/laporan/${id}`),
  updateStatus: (id, status, tanggapan) => api.put(`/laporan/${id}/status`, { status, tanggapan }),
};

export const trackingAPI = {
  getByTicketCode: (ticket_code) => api.get(`/tracking/${ticket_code}`),
  getHistory: (id_laporan) => api.get(`/tracking/history/${id_laporan}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  updateStatus: (id, status, tanggapan) => api.put(`/admin/laporan/${id}/status`, { status, tanggapan }),
};

export const masterAPI = {
  getAnalytics: () => api.get('/master/analytics'),
  getAllReports: (filters) => api.get('/master/reports', { params: filters }),
  getHeatmap: () => api.get('/master/heatmap'),
};

export default api;
