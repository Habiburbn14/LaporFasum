import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/authApi';

function ProtectedRoute({ children }) {
  // Bypass login check for direct access
  return children;
}

export default ProtectedRoute;
