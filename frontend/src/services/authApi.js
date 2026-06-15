import { apiClient } from './apiClient';

export const authApi = {
  login: async (username, password) => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }
};
