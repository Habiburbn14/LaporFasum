import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`
});

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${baseUrl}/auth/me`, {
      headers: getAuthHeaders()
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || 'Gagal mengambil data profil' };
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const response = await axios.put(`${baseUrl}/auth/me`, updates, {
      headers: getAuthHeaders()
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || 'Gagal memperbarui profil' };
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${baseUrl}/auth/me/avatar`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return { success: true, url: response.data.avatar_url };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || 'Gagal mengunggah foto' };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${baseUrl}/auth/me/change-password`,
      { old_password: oldPassword, new_password: newPassword },
      { headers: getAuthHeaders() }
    );
    return { success: true, message: response.data.message || 'Password berhasil diubah' };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || 'Gagal mengubah password' };
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${baseUrl}/feedback`, feedbackData, {
      headers: getAuthHeaders()
    });
    return { success: true, message: response.data?.message || 'Feedback berhasil dikirim' };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || 'Gagal mengirim feedback' };
  }
};

export const logoutUser = async () => {
  localStorage.removeItem('access_token');
  return { success: true };
};
