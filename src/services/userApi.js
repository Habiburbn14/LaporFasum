import { MOCK_USER_PROFILE } from '../utils/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getUserProfile = async () => {
  await delay(800);
  return { success: true, data: MOCK_USER_PROFILE };
};

export const updateUserProfile = async (updates) => {
  await delay(1000);
  try {
    const updated = { ...MOCK_USER_PROFILE, ...updates };
    Object.assign(MOCK_USER_PROFILE, updated);
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: 'Gagal memperbarui profil' };
  }
};

export const uploadAvatar = async (file) => {
  await delay(1500);
  try {
    const seed = file || `avatar-${Date.now()}`;
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    MOCK_USER_PROFILE.avatar = newAvatarUrl;
    return { success: true, url: newAvatarUrl };
  } catch (error) {
    return { success: false, error: 'Gagal mengunggah foto' };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  await delay(1000);
  if (oldPassword !== 'password123') {
    return { success: false, error: 'Password lama tidak sesuai' };
  }
  if (newPassword.length < 8) {
    return { success: false, error: 'Password minimal 8 karakter' };
  }
  return { success: true, message: 'Password berhasil diubah' };
};

export const submitFeedback = async (feedbackData) => {
  await delay(1200);
  try {
    return { success: true, message: 'Feedback berhasil dikirim' };
  } catch (error) {
    return { success: false, error: 'Gagal mengirim feedback' };
  }
};

export const logoutUser = async () => {
  await delay(500);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return { success: true };
};
