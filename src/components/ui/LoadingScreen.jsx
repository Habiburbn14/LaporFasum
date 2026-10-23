import React from 'react';
import { Loader2 } from 'lucide-react';
import BottomNav from '../mobile/BottomNav';

export function LoadingScreen({ message = 'Memuat...', className = '', bg = 'bg-slate-50', withNav = false }) {
  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center ${withNav ? 'max-w-[430px] mx-auto pb-28' : ''} ${className}`}>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-sm mx-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600 text-sm">{message}</p>
      </div>
      {withNav && <BottomNav />}
    </div>
  );
}

export default LoadingScreen;