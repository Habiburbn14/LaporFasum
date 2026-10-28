export async function uploadLaporan(formData) {
  const token = sessionStorage.getItem('access_token');
  const baseUrl = import.meta.env.VITE_BASE_URL || '';
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  
  try {
    const response = await fetch(baseUrl + '/laporan', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Tunnel-Skip-Anti-Phishing-Page': 'true',
      },
      body: formData,
      credentials: 'include',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}