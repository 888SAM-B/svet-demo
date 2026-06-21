import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('svet_admin_token');
      if (token) {
        try {
          const profile = await apiClient('/auth/me');
          setUser(profile);
        } catch (err) {
          console.error('[Auth Init Failed] Clearing token:', err);
          localStorage.removeItem('svet_admin_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('svet_admin_token', data.access_token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('[Logout Error] Failed to contact server:', err);
    } finally {
      localStorage.removeItem('svet_admin_token');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await apiClient('/auth/me');
      setUser(profile);
      return profile;
    } catch (err) {
      localStorage.removeItem('svet_admin_token');
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
