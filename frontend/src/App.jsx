import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import HomePage from './pages/Home/HomePage';
import ApplyFormPage from './pages/ApplyForm/ApplyFormPage';
import AdminLoginPage from './pages/AdminLogin/AdminLoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LeadsPage from './pages/Leads/LeadsPage';
import CountriesPage from './pages/Countries/CountriesPage';
import PageBuilderPage from './pages/Countries/PageBuilderPage';
import GalleryManagementPage from './pages/Gallery/GalleryManagementPage';
import SplashScreen from './components/Common/SplashScreen';

// Protected Route Wrapper for Admin Paths
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('svet_admin_token');
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
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
          <Route path="/admin" element={<AdminLoginPage />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/leads" 
            element={
              <ProtectedRoute>
                <LeadsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/countries" 
            element={
              <ProtectedRoute>
                <CountriesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/countries/:id/builder" 
            element={
              <ProtectedRoute>
                <PageBuilderPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gallery" 
            element={
              <ProtectedRoute>
                <GalleryManagementPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ApplicationProvider>
  );
}

