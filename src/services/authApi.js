import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const loginUser = async (email, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await axios.post(
      `${baseUrl}/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      return { success: true, token: response.data.access_token };
    }
    return { success: false, error: 'Login gagal' };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || 'Login gagal' };
  }
};

export const registerUser = async (data) => {
  try {
    const payload = {
      nama_lengkap: data.nama_lengkap,
      nik: data.nik,
      email: data.email,
      password: data.password,
      alamat_domisili: data.alamat_domisili,
      id_kecamatan: data.id_kecamatan,
      id_kabupaten: 1
    };

    const response = await axios.post(
      `${baseUrl}/auth/register/user`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      return { success: true, token: response.data.access_token };
    }
    return { success: true, token: null };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || 'Pendaftaran gagal' };
  }
};

export const getKecamatan = async () => {
  try {
    const response = await axios.get(`${baseUrl}/auth/kecamatan`);
    return response.data;
  } catch (error) {
    console.error('Error fetching kecamatan:', error);
    return [];
  }
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('access_token');
};

export const logout = () => {
  localStorage.removeItem('access_token');
};
