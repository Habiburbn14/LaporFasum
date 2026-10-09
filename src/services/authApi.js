import axios from 'axios';

export const loginUser = async (nik, email, password, isAdmin = false) => {
  // Mock authentication for development
  console.log('Login attempt:', { email, isAdmin });
  
  // For development, accept any non-empty password
  if (!email || !password) {
    return { success: false, error: 'Email dan password harus diisi' };
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create mock token
  const mockToken = 'mock-token-' + Date.now();
  
  // Determine user role
  let role = 'user';
  if (email.includes('admin') || isAdmin) {
    role = 'admin';
  }
  
  // Store in localStorage
  localStorage.setItem('access_token', mockToken);
  localStorage.setItem('user_email', email);
  localStorage.setItem('user_role', role);
  
  return { 
    success: true, 
    token: mockToken,
    user: {
      email,
      role,
      name: email.includes('admin') ? 'Admin Kabupaten' : 'Warga Lamongan'
    }
  };
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
      'http://localhost:8000/auth/register',
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
