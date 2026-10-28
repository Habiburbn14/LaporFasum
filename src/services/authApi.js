import axios from 'axios';
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
      sessionStorage.setItem('access_token', response.data.access_token);
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
export const registerUser = async (nama, nik, email, password) => {
  try {
    const payload = {
      nik,
      email,
      password,
      nama_lengkap,
      role: 1,
      
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
      sessionStorage.setItem('access_token', response.data.access_token);
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

// *GET ACCESS TOKEN
export const getAccessToken = () => {
  return sessionStorage.getItem('access_token');
};

// *IS LOGIN
export const isLoggedIn = () => {
  return !!sessionStorage.getItem('access_token');
};

// *LOGOUT
export const logout = () => {
  sessionStorage.removeItem('access_token');
};
