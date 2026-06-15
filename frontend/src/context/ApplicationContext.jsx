import React, { createContext, useContext, useState, useEffect } from 'react';
import { studentApi } from '../services/studentApi';

const ApplicationContext = createContext();

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await studentApi.getStudents();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load students', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load applications on mount
  useEffect(() => {
    const token = localStorage.getItem('svet_admin_token');
    if (token) {
      loadStudents();
    } else {
      setIsLoading(false);
    }
  }, []);

  const addApplication = async (formData) => {
    setIsSaving(true);
    try {
      const newApp = await studentApi.apply(formData);
      setApplications((prev) => [newApp, ...prev]);
      return newApp;
    } catch (error) {
      console.error('Failed to add application', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateApplication = async (id, updatedFields) => {
    setIsSaving(true);
    try {
      const result = await studentApi.updateStatus(id, updatedFields.status, updatedFields.notes || "");
      if (result.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, ...updatedFields } : app))
        );
      }
      return result;
    } catch (error) {
      console.error('Failed to update application', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteApplication = async (id) => {
    setIsSaving(true);
    try {
      const result = await studentApi.deleteStudent(id);
      if (result.success) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
      }
      return result;
    } catch (error) {
      console.error('Failed to delete application', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      const resetList = await studentApi.resetDemo();
      setApplications(resetList);
      return true;
    } catch (error) {
      console.error('Failed to reset demo data', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        isLoading,
        isSaving,
        loadStudents,
        addApplication,
        updateApplication,
        deleteApplication,
        resetDemoData,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
export default ApplicationContext;
