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

export const registerUser = async (nama, nik, email, password) => {
  try {
    const payload = {
      nama,
      nik,
      email,
      password
    };

    const response = await axios.post(
      `${baseUrl}/auth/register`,
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

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('access_token');
};

export const logout = () => {
  localStorage.removeItem('access_token');
};
