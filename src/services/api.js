import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
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

// Auto-retry 1x on network error or timeout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Never retry cancelled requests
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }
    if (!config || config._retry) {
      return Promise.reject(error);
    }
    // Retry on network errors or 5xx server errors
    if (error.code === 'ECONNABORTED' || !error.response || (error.response.status >= 500 && error.response.status < 600)) {
      config._retry = true;
      try {
        return await api(config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    return Promise.reject(error);
  }
);

// export const authAPI = {
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   register: (data) => api.post('/auth/register', data),
// };

export const laporanAPI = {
  create: (data) =>
    api.post('/laporan', data),
  list: (filters, config) => api.get('/laporan', { ...config, params: filters }),
  getById: (id) => api.get(`/laporan/${id}`),
  updateStatus: (id, status, tanggapan, kewenangan) => {
    const formData = new FormData();
    formData.append('id_laporan', id);
    formData.append('status_terkini', status);
    if (tanggapan !== undefined && tanggapan !== null) {
      formData.append('tanggapan_admin', tanggapan);
    }
    if (kewenangan !== undefined && kewenangan !== null && kewenangan !== '') {
      formData.append('kewenangan_penanganan', kewenangan);
    }
    return api.put(`/laporan/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const trackingAPI = {
  getByTicketCode: (ticket_code) => api.get(`/tracking/${ticket_code}`),
  getHistory: (id_laporan) => api.get(`/tracking/history/${id_laporan}`),
};

export const adminAPI = {
  getDashboard: () => api.get(`/dashboard/admin?_t=${Date.now()}`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  }),
  updateStatus: (id, status, tanggapan, kewenangan) => {
    const formData = new FormData();
    formData.append('id_laporan', id);
    formData.append('status_terkini', status);
    if (tanggapan !== undefined && tanggapan !== null) {
      formData.append('tanggapan_admin', tanggapan);
    }
    if (kewenangan !== undefined && kewenangan !== null && kewenangan !== '') {
      formData.append('kewenangan_penanganan', kewenangan);
    }
    return api.put(`/admin/laporan/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
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
