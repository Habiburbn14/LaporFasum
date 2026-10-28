export const getErrorMessage = (error) => {
  if (!error) return 'Terjadi kesalahan tidak diketahui';
  
  if (typeof error === 'string') return error;
  
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (Array.isArray(detail)) {
      return detail.map(d => d.msg || 'Validation error').join(', ');
    }
    return detail;
  }
  
  if (error.response?.data?.message) return error.response.data.message;
  
  if (error.message) return error.message;
  
  return 'Gagal memuat data';
};

export const isErrorResponse = (result) => {
  return result && typeof result === 'object' && !result.success;
};