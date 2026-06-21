import { apiClient } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const studentApi = {
  apply: async (formData) => {
    return apiClient('/students/apply', {
      method: 'POST',
      body: formData
    });
  },

  checkStatus: async (identifier, dob) => {
    return apiClient('/students/status', {
      method: 'POST',
      body: JSON.stringify({ identifier, dob })
    });
  },

  getStudents: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.country) params.append('country', filters.country);
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFilter) params.append('date_range', filters.dateFilter);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/students${queryString}`);
  },

  getStudent: async (id) => {
    return apiClient(`/students/${id}`);
  },

  updateStatus: async (id, status, notes = "") => {
    return apiClient(`/students/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },

  deleteStudent: async (id) => {
    return apiClient(`/students/${id}`, {
      method: 'DELETE'
    });
  },

  resetDemo: async () => {
    return apiClient('/students/reset', {
      method: 'POST'
    });
  },

  // Renders secure authorized downloads for candidate documents in Lead Drawer
  downloadFileBlobUrl: async (applicationId, filename) => {
    const token = localStorage.getItem('svet_admin_token');
    const response = await fetch(`${API_BASE_URL}/files/students/${applicationId}/${filename}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load secure document: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
};
