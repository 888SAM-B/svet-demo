const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api/v1', '');
const PUBLIC_BASE_URL = `${BACKEND_BASE_URL}/api/public`;

import { apiClient } from './apiClient';

// Helper — prepend backend host to stored relative paths like /uploads/countries/...
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BACKEND_BASE_URL}${path}`;
};

export const countryApi = {
  // ── Public (no auth) ────────────────────────────────────────────────────
  getPublicCountries: async () => {
    const res = await fetch(`${PUBLIC_BASE_URL}/countries`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    return res.json();
  },

  getPublicCountry: async (slug) => {
    const res = await fetch(`${PUBLIC_BASE_URL}/countries/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch country details');
    return res.json();
  },

  // ── Admin — Countries ────────────────────────────────────────────────────
  getAdminCountries: () => apiClient('/admin/countries'),

  createCountry: (data) =>
    apiClient('/admin/countries', { method: 'POST', body: JSON.stringify(data) }),

  updateCountry: (id, data) =>
    apiClient(`/admin/countries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteCountry: (id) =>
    apiClient(`/admin/countries/${id}`, { method: 'DELETE' }),

  toggleCountry: (id) =>
    apiClient(`/admin/countries/${id}/toggle`, { method: 'PATCH' }),

  reorderCountries: (orderedIds) =>
    apiClient('/admin/countries/reorder', {
      method: 'POST',
      body: JSON.stringify({ ordered_ids: orderedIds }),
    }),

  uploadCountryImage: async (file, subFolder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sub_folder', subFolder);
    return apiClient('/admin/countries/upload', { method: 'POST', body: formData });
  },

  // ── Admin — Sections ─────────────────────────────────────────────────────
  getSections: (countryId) => apiClient(`/admin/countries/${countryId}/sections`),

  createSection: (countryId, data) =>
    apiClient(`/admin/countries/${countryId}/sections`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSection: (countryId, sectionId, data) =>
    apiClient(`/admin/countries/${countryId}/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteSection: (countryId, sectionId) =>
    apiClient(`/admin/countries/${countryId}/sections/${sectionId}`, { method: 'DELETE' }),

  reorderSections: (countryId, orderedIds) =>
    apiClient(`/admin/countries/${countryId}/sections/reorder`, {
      method: 'POST',
      body: JSON.stringify({ ordered_ids: orderedIds }),
    }),

  toggleSection: (countryId, sectionId) =>
    apiClient(`/admin/countries/${countryId}/sections/${sectionId}/toggle`, { method: 'PATCH' }),

  // ── Admin — SEO ──────────────────────────────────────────────────────────
  getSEO: (countryId) => apiClient(`/admin/countries/${countryId}/seo`),

  saveSEO: (countryId, data) =>
    apiClient(`/admin/countries/${countryId}/seo`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
