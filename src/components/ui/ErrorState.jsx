import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import BottomNav from '../mobile/BottomNav';

export function ErrorState({ message = 'Gagal memuat data', onRetry, className = '', bg = 'bg-slate-50', withNav = false }) {
  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center p-4 ${withNav ? 'max-w-[430px] mx-auto pb-28' : ''} ${className}`}>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-sm w-full">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-800 text-base mb-1">Terjadi Kesalahan</h3>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        )}
      </div>
      {withNav && <BottomNav />}
    </div>
  );
}

export default ErrorState;