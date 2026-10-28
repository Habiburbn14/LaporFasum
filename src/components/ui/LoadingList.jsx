import React from 'react';
import { Loader2, HelpCircle } from 'lucide-react';

export function LoadingList({ message = 'Memuat...', className = '' }) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
      <p className="text-slate-600 text-sm">{message}</p>
    </div>
  );
}

export default LoadingList;