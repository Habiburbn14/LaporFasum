import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

function LogoutConfirm({ isOpen, onClose, onConfirm, isLoading = false }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Keluar dari Aplikasi?</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Anda akan keluar dari sesi ini. Data yang belum disimpan akan hilang.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 border border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Memproses...' : 'Keluar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirm;