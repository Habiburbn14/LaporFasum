import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import Dashboard_Logo from '../../assets/Dashboard_Logo.svg';

export function SplashScreen({ minDuration = 1500 }) {
  const [isVisible, setIsVisible] = useState(true);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    let mounted = true;
    
    const checkReady = () => {
      if (!loading && mounted) {
        setIsVisible(false);
      } else if (mounted) {
        requestAnimationFrame(checkReady);
      }
    };

    // Minimum duration timer
    const timer = setTimeout(() => {
      checkReady();
    }, minDuration);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [loading, minDuration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-500">
      <div className="animate-pulse flex items-center justify-center">
        <img src={Dashboard_Logo} alt="Logo" className="w-52 h-auto object-contain" />
      </div>
    </div>
  );
}

export default SplashScreen;