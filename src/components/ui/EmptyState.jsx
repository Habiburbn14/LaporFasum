import React from 'react';
import { PackageOpen } from 'lucide-react';

export function EmptyState({ 
  message = 'Data tidak ditemukan', 
  subMessage = 'Coba filter atau kriteria lainnya', 
  className = '' 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <PackageOpen className="w-8 h-8" />
      </div>
      <h3 className="font-semibold text-slate-800 text-base mb-1">{message}</h3>
      <p className="text-slate-500 text-sm max-w-[240px] mx-auto">{subMessage}</p>
    </div>
  );
}

export default EmptyState;