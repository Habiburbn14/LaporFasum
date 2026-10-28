import React, { useEffect, useState } from 'react';
import Dashboard_Logo from '../../assets/Dashboard_Logo.svg';

export function SplashScreen({ duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

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