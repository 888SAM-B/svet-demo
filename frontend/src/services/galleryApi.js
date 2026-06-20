const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api/v1', '');
const PUBLIC_BASE_URL = `${BACKEND_BASE_URL}/api/public`;

import { apiClient } from './apiClient';

export const galleryApi = {
  // ── Public (no auth) ────────────────────────────────────────────────────
  getPublicGallery: async () => {
    const res = await fetch(`${PUBLIC_BASE_URL}/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  // ── Admin (auth required) ───────────────────────────────────────────────
  getAdminGallery: () => apiClient('/admin/gallery'),

  createGalleryImage: (data) =>
    apiClient('/admin/gallery', { method: 'POST', body: JSON.stringify(data) }),

  updateGalleryImage: (id, data) =>
    apiClient(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteGalleryImage: (id) =>
    apiClient(`/admin/gallery/${id}`, { method: 'DELETE' }),

  toggleGalleryImage: (id) =>
    apiClient(`/admin/gallery/${id}/toggle`, { method: 'PATCH' }),

  reorderGalleryImages: (orderedIds) =>
    apiClient('/admin/gallery/reorder', {
      method: 'POST',
      body: JSON.stringify({ ordered_ids: orderedIds }),
    }),

  uploadGalleryImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient('/admin/gallery/upload', { method: 'POST', body: formData });
  },
};
