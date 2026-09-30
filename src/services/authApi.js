export const loginUser = async (nik, email, password, isAdmin = false) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (password === 'password123') {
    return { success: true, token: 'mock-jwt-token' };
  }
  return { success: false, error: 'NIK/Email atau password salah' };
};

export const registerUser = async (nama, nik, email, password) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, token: 'mock-jwt-token' };
};
