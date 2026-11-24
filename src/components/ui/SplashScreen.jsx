import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import Dashboard_Logo from '../../assets/Dashboard_Logo.svg';

export function SplashScreen({ minDuration = 1500, maxDuration = 10000 }) {
  const [isVisible, setIsVisible] = useState(true);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    let mounted = true;
    let hideTimer = null;
    
    const checkReady = () => {
      if (!loading && mounted) {
        setIsVisible(false);
      } else if (mounted) {
        requestAnimationFrame(checkReady);
      }
    };

    // Minimum duration timer
    const minTimer = setTimeout(() => {
      checkReady();
    }, minDuration);

    // Maximum duration - force hide after maxDuration
    const maxTimer = setTimeout(() => {
      if (mounted) {
        console.log('[SplashScreen] Max duration reached, hiding');
        setIsVisible(false);
      }
    }, maxDuration);

    return () => {
      mounted = false;
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [loading, minDuration, maxDuration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-500">
      <div className="animate-pulse flex flex-col items-center justify-center gap-4">
        <img src={Dashboard_Logo} alt="Logo" className="w-52 h-auto object-contain" />
      </div>
    </div>
  );
}

export default SplashScreen;