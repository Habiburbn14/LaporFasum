import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, roleOf, homePathForRole } from '../stores/useAuthStore';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuthStore();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const role = roleOf(user);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={isAdminPath ? '/admin-login' : '/login'}
        replace
        state={{ from: location }}
      />
    );
  }

  // Role restriction: if roles provided, user's role must be included
  if (roles && !roles.includes(role)) {
    return <Navigate to={homePathForRole(role)} replace />;
  }

  return children;
}

export default ProtectedRoute;