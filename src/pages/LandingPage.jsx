import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useAuthStore, roleOf, homePathForRole } from '../stores/useAuthStore';

function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Always attempt redirect when loading changes or user changes
    if (loading) {
      console.log('[LandingPage] Still loading...');
      return;
    }
    
    console.log('[LandingPage] Loading complete, user:', user ? 'logged in' : 'not logged in');
    
    if (!user) {
      // Not logged in - redirect to appropriate login page
      const isNative = Capacitor.isNativePlatform();
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const loginPath = (isNative || isMobile) ? '/login' : '/login-admin';
      console.log('[LandingPage] Redirecting to:', loginPath);
      navigate(loginPath, { replace: true });
    } else {
      // Already logged in - go to home page for their role
      const homePath = homePathForRole(roleOf(user));
      const targetPath = from !== '/' ? from : homePath;
      console.log('[LandingPage] Redirecting to home:', targetPath);
      navigate(targetPath, { replace: true });
    }
  }, [navigate, user, loading, from]);

  // Safety fallback - if somehow we get here without redirect, force it
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (loading) return;
      if (!user) {
        const isNative = Capacitor.isNativePlatform();
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const loginPath = (isNative || isMobile) ? '/login' : '/login-admin';
        console.log('[LandingPage] Fallback redirect to:', loginPath);
        navigate(loginPath, { replace: true });
      }
    }, 1000);
    return () => clearTimeout(fallback);
  }, [loading, user, navigate]);

  return null;
}

export default LandingPage;