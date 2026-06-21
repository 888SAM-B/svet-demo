import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Admin/ProtectedRoute';

import HomePage from './pages/Home/HomePage';
import ApplyFormPage from './pages/ApplyForm/ApplyFormPage';
import AdminLoginPage from './pages/AdminLogin/AdminLoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LeadsPage from './pages/Leads/LeadsPage';
import CountriesPage from './pages/Countries/CountriesPage';
import PageBuilderPage from './pages/Countries/PageBuilderPage';
import GalleryManagementPage from './pages/Gallery/GalleryManagementPage';
import UserManagementPage from './pages/UserManagement/UserManagementPage';
import AdministrationPage from './pages/Administration/AdministrationPage';
import SettingsPage from './pages/Settings/SettingsPage';
import UnauthorizedPage from './pages/Unauthorized/UnauthorizedPage';
import SplashScreen from './components/Common/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <ApplicationProvider>
        {showSplash && (
          <SplashScreen 
            onComplete={() => {
              setShowSplash(false);
            }} 
          />
        )}
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/apply" element={<ApplyFormPage />} />
            
            {/* Admin Authentication Gate */}
            <Route path="/login" element={<AdminLoginPage />} />
            
            {/* Backwards compatibility redirect for old /admin route */}
            <Route path="/admin" element={<Navigate to="/login" replace />} />
            <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['MASTER_ADMIN', 'LEAD_MANAGER']}>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/manage-leads" 
              element={
                <ProtectedRoute allowedRoles={['MASTER_ADMIN', 'LEAD_MANAGER']}>
                  <LeadsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/country-management" 
              element={
                <ProtectedRoute allowedRoles={['MASTER_ADMIN', 'COUNTRY_MANAGER']}>
                  <CountriesPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/country-management/:id/builder" 
              element={
                <ProtectedRoute allowedRoles={['MASTER_ADMIN', 'COUNTRY_MANAGER']}>
                  <PageBuilderPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/gallery" 
              element={
                <ProtectedRoute allowedRoles={['MASTER_ADMIN', 'LEAD_MANAGER']}>
                  <GalleryManagementPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={['MASTER_ADMIN']}>
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/administration" 
              element={
                <ProtectedRoute allowedRoles={['MASTER_ADMIN']}>
                  <AdministrationPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={['MASTER_ADMIN']}>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />

            {/* Unauthorized Fallback */}
            <Route path="/403" element={<UnauthorizedPage />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ApplicationProvider>
    </AuthProvider>
  );
}
