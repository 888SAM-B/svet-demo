const STORAGE_KEY = 'svet_applications';

export const localStorageService = {
  getApplications: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  },

  saveApplicationsList: (applications) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage', error);
      return false;
    }
  },

  saveApplication: (newApp) => {
    try {
      const currentList = localStorageService.getApplications() || [];
      const updatedList = [newApp, ...currentList];
      localStorageService.saveApplicationsList(updatedList);
      return newApp;
    } catch (error) {
      console.error('Error saving application', error);
      return null;
    }
  },

  updateApplication: (id, updatedApp) => {
    try {
      const currentList = localStorageService.getApplications() || [];
      const updatedList = currentList.map(app => app.id === id ? { ...app, ...updatedApp } : app);
      localStorageService.saveApplicationsList(updatedList);
      return true;
    } catch (error) {
      console.error('Error updating application', error);
      return false;
    }
  },

  deleteApplication: (id) => {
    try {
      const currentList = localStorageService.getApplications() || [];
      const updatedList = currentList.filter(app => app.id !== id);
      localStorageService.saveApplicationsList(updatedList);
      return true;
    } catch (error) {
      console.error('Error deleting application', error);
      return false;
    }
  },

  clearApplications: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  }
};
