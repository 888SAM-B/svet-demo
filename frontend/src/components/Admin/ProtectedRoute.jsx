import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F7] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3F72AF] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#112D4E] font-display font-bold">Verifying Session...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the 403 Access Denied page
    return <Navigate to="/403" replace />;
  }

  return children;
}
