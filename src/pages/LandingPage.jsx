import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

function LandingPage() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const loginPath = (isNative || isMobile) ? '/login' : '/login-admin';
    
    window.location.href = `${loginPath}${from !== '/' ? `?redirect=${encodeURIComponent(from)}` : ''}`;
  }, [from]);

  return null;
}

export default LandingPage;