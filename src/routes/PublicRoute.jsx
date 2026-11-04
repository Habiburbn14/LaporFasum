import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, roleOf, homePathForRole } from '../stores/useAuthStore';

function PublicRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={homePathForRole(roleOf(user))} replace />;
  }

  return children;
}

export default PublicRoute;