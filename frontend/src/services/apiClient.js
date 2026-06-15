const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Clone or initialize headers
  const headers = options.headers ? { ...options.headers } : {};
  
  // DO NOT add Content-Type for FormData, the browser will set it with the correct boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  
  // Pull admin token from LocalStorage and append
  const token = localStorage.getItem('svet_admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, config);
    
    // Redirect on unauthorized JWT token validation failure
    if (response.status === 401) {
      localStorage.removeItem('svet_admin_token');
      if (window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
      throw new Error('Unauthorized session. Redirecting to login...');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      let detail = `Request failed: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        detail = errorJson.detail || detail;
      } catch (e) {
        detail = errorText || detail;
      }
      throw new Error(detail);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`[API Client Error] Endpoint: ${endpoint}`, error);
    throw error;
  }
};
