import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';

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

  // Load applications on mount
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const data = await mockApi.getStudents();
        setApplications(data);
      } catch (error) {
        console.error('Failed to load students', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const addApplication = async (studentData) => {
    setIsSaving(true);
    try {
      const newApp = await mockApi.registerStudent(studentData);
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
      const result = await mockApi.updateStudent(id, updatedFields);
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
      const result = await mockApi.deleteStudent(id);
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
      const resetList = await mockApi.resetDemo();
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
