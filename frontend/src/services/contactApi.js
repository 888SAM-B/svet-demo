import { apiClient } from './apiClient';

export const contactApi = {
  submitEnquiry: async (name, email, mobile, preferred_country, message) => {
    return apiClient('/contact', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        mobile,
        preferred_country,
        message
      })
    });
  }
};
