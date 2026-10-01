import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/authApi';

function PublicRoute({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default PublicRoute;