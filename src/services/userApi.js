import axios from 'axios';
import { getAccessToken } from './authApi';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeaders = () => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'WWW-Authenticate': 'Bearer'
  };
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/auth/me`,
      { headers: authHeaders() }
    );

    const user = response.data;
    return { 
      success: true, 
      data: {
        id: user.id_user,
        nama: user.nama_lengkap,
        nik: user.nik,
        email: user.email,
        alamat_domisili: user.alamat_domisili,
        id_role: user.id_role,
        id_kecamatan: user.id_kecamatan,
        id_kabupaten: user.id_kabupaten,
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        isVerified: true,
        lokasi: user.alamat_domisili || 'Kabupaten Lamongan',
        joinDate: '2026-01-15'
      }
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal memuat profil' };
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const payload = {
      nama_lengkap: updates.nama,
      email: updates.email,
      alamat_domisili: updates.lokasi,
      nik: updates.nik
    };
    
    const response = await axios.put(
      `${BASE_URL}/me`,
      payload,
      { headers: authHeaders() }
    );

    const user = response.data;
    return { 
      success: true, 
      data: {
        id: user.id_user,
        nama: user.nama_lengkap,
        nik: user.nik,
        email: user.email,
        alamat_domisili: user.alamat_domisili,
        id_role: user.id_role,
        id_kecamatan: user.id_kecamatan,
        id_kabupaten: user.id_kabupaten,
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        isVerified: true,
        lokasi: user.alamat_domisili || 'Kabupaten Lamongan',
        joinDate: '2026-01-15'
      }
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal memperbarui profil' };
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axios.post(
      `${BASE_URL}/me/avatar`,
      formData, 
      { 
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
          'WWW-Authenticate': 'Bearer'
        }
      }
    );

    return { success: true, url: response.data.avatar_url };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal mengunggah foto' };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/me/change-password`,
      { old_password: oldPassword, new_password: newPassword },
      { headers: authHeaders() }
    );

    return { success: true, message: response.data.message || 'Password berhasil diubah' };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal mengubah password' };
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/feedback`,
      feedbackData,
      { headers: authHeaders() }
    );

    return { success: true, message: response.data.message || 'Feedback berhasil dikirim' };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal mengirim feedback' };
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('access_token');
  return { success: true };
};

export const getDashboardWarga = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/dashboard/user`,
      { headers: authHeaders() }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal memuat dashboard' };
  }
};

export const getMyReports = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/laporan/saya`,
      { headers: authHeaders() }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal memuat laporan Anda' };
  }
};

export const getReportsByFilter = async (filter = 'all') => {
  try {
    const endpoint = filter === 'mine' ? '/laporan/saya' : '/laporan';
    const response = await axios.get(
      `${BASE_URL}${endpoint}`,
      { headers: authHeaders() }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal memuat laporan' };
  }
};

export const getNotifications = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/dashboard/notifikasi`,
      { headers: authHeaders() }
    );

    const notifications = response.data?.data || response.data || [];
    return { success: true, data: Array.isArray(notifications) ? notifications : [] };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal memuat notifikasi', data: [] };
  }
};

export const getMapPoints = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/peta/titik-laporan`,
      { headers: authHeaders() }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('unauthorized');
    }
    return { success: false, error: error.response?.data?.detail || 'Gagal memuat titik peta' };
  }
};