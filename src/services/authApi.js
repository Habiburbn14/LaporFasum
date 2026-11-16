import axios from 'axios';
import { persistedAuthStorage } from '../lib/storage';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// *LOGIN
export const loginUser = async (identifier, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      { identifier, password },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.access_token) {
      await persistedAuthStorage.setItem('access_token', response.data.access_token);
      return { 
        success: true, 
        token: response.data.access_token,
        user: response.data.user
      };
    }
    return { success: false, error: 'Login gagal' };
  } catch (error) {
    let errorMessage = 'Login gagal';
    const detail = error.response?.data?.detail;
    if (Array.isArray(detail)) {
      errorMessage = detail.map(d => d.msg || d.message).join(', ');
    } else if (typeof detail === 'object' && detail !== null) {
      errorMessage = detail.msg || detail.message || JSON.stringify(detail);
    } else if (typeof detail === 'string') {
      errorMessage = detail;
    }
    return { success: false, error: errorMessage };
  }
};

// *REGISTER
export const registerUser = async (nama, nik, email, password, alamat_domisili, id_kecamatan, id_kabupaten) => {
  try {
    const payload = {
      nik,
      email,
      password,
      nama_lengkap: nama,
      role: 1,
      alamat_domisili,
      id_kecamatan: id_kecamatan || null,
      id_kabupaten: id_kabupaten || 1,
    };

    const response = await axios.post(
      `${BASE_URL}/auth/register/user`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.access_token) {
      await persistedAuthStorage.setItem('access_token', response.data.access_token);
      return { success: true, token: response.data.access_token };
    }
    return { success: true, token: null };
  } catch (error) {
    let errorMessage = 'Pendaftaran gagal';
    const detail = error.response?.data?.detail;
    if (Array.isArray(detail)) {
      errorMessage = detail.map(d => d.msg || d.message).join(', ');
    } else if (typeof detail === 'object' && detail !== null) {
      errorMessage = detail.msg || detail.message || JSON.stringify(detail);
    } else if (typeof detail === 'string') {
      errorMessage = detail;
    }
    return { success: false, error: errorMessage };
  }
};

// *VERIFIKASI AKUN LUPA SANDI (NIK + Email)
export const verifyResetAccount = async (nik, email) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/verify-reset`,
      { nik, email },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = 'Verifikasi akun gagal';
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') {
      errorMessage = detail;
    } else if (Array.isArray(detail)) {
      errorMessage = detail.map(d => d.msg || d.message).join(', ');
    }
    return { success: false, error: errorMessage };
  }
};

// *RESET KATA SANDI BARU
export const resetPassword = async (nik, email, newPassword) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/reset-password`,
      { nik, email, new_password: newPassword },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return { 
      success: true, 
      message: response.data?.message || 'Kata sandi berhasil diperbarui' 
    };
  } catch (error) {
    let errorMessage = 'Gagal mereset kata sandi';
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') {
      errorMessage = detail;
    } else if (Array.isArray(detail)) {
      errorMessage = detail.map(d => d.msg || d.message).join(', ');
    }
    return { success: false, error: errorMessage };
  }
};

// *GET ACCESS TOKEN
export const getAccessToken = async () => {
  return persistedAuthStorage.getItem('access_token');
};

// *IS LOGIN
export const isLoggedIn = async () => {
  const token = await persistedAuthStorage.getItem('access_token');
  return !!token;
};

// *LOGOUT
export const logout = async () => {
  await persistedAuthStorage.removeItem('access_token');
};
