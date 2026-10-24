import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: `${BASE_URL}`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Set JSON content-type for non-FormData requests
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  // Required for devtunnels to bypass anti-phishing page
  config.headers['X-Tunnel-Skip-Anti-Phishing-Page'] = 'true';
  return config;
});

// export const authAPI = {
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   register: (data) => api.post('/auth/register', data),
// };

export const laporanAPI = {
  create: (data) =>
    api.post('/laporan', data),
  list: (filters) => api.get('/laporan', { params: filters }),
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

export const gisAPI = {
  getBatasWilayah: () => api.get('/peta/batas-wilayah', {
    responseType: 'text'
  }),
};

export default api;
