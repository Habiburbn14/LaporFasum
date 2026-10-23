import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessStepPage() {
  const navigate = useNavigate();
  const ticketId = sessionStorage.getItem('report_ticketId');

  useEffect(() => {
    if (!ticketId) {
      navigate('/');
    }
  }, [ticketId, navigate]);

  const handleDone = useCallback(() => {
    const keysToRemove = [
      'report_photoUrl',
      'report_locationData',
      'report_formData',
      'report_submitTime',
      'report_ticketId'
    ];
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col items-center justify-center px-8 text-center pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
      <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">Laporan Berhasil Terkirim!</h1>
      <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-5">
        Terima kasih telah berpartisipasi melaporkan fasilitas umum. Laporan Anda akan segera ditinjau oleh dinas terkait.
      </p>
      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-4 py-2 rounded-full mb-10 inline-flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">#</span>
        ID: {ticketId}
      </span>
      <button
        onClick={handleDone}
        className="w-full border-2 border-blue-600 text-blue-600 font-bold rounded-xl py-3.5 text-sm transition-all hover:bg-blue-50 active:bg-blue-100"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}