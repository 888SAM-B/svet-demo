import { localStorageService } from './localStorageService';
import { mockStudents } from '../data/mockStudents';

const LATENCY = 800; // 800ms simulated API latency

const simulateDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, LATENCY);
  });
};

export const mockApi = {
  getStudents: () => {
    let list = localStorageService.getApplications();
    if (!list) {
      // Seed data if empty
      localStorageService.saveApplicationsList(mockStudents);
      list = mockStudents;
    }
    return simulateDelay([...list]);
  },

  registerStudent: (studentData) => {
    // Generate ID: SVET-2026-XXX
    const currentList = localStorageService.getApplications() || mockStudents;
    const latestNum = currentList.reduce((max, app) => {
      const match = app.id.match(/SVET-2026-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      return max;
    }, 20); // starts at least at 20
    
    const newIdNum = String(latestNum + 1).padStart(3, '0');
    const newId = `SVET-2026-${newIdNum}`;

    const newApp = {
      id: newId,
      ...studentData,
      status: 'Pending Review',
      createdDate: new Date().toISOString()
    };

    localStorageService.saveApplication(newApp);
    return simulateDelay(newApp);
  },

  updateStudent: (id, updatedFields) => {
    const success = localStorageService.updateApplication(id, updatedFields);
    return simulateDelay({ success, id, updatedFields });
  },

  deleteStudent: (id) => {
    const success = localStorageService.deleteApplication(id);
    return simulateDelay({ success, id });
  },

  resetDemo: () => {
    localStorageService.clearApplications();
    localStorageService.saveApplicationsList(mockStudents);
    return simulateDelay(mockStudents);
  }
};
