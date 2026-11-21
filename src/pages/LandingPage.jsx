import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const loginPath = (isNative || isMobile) ? '/login' : '/login-admin';
    
    navigate(loginPath, { replace: true });
  }, [navigate]);

  return null;
}

export default LandingPage;