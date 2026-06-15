import { apiClient } from './apiClient';

export const dashboardApi = {
  getStats: async () => {
    return apiClient('/dashboard/stats');
  }
};
