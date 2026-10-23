import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Send } from 'lucide-react';

export default function FormStepPage() {
  const navigate = useNavigate();
  
  const photoUrl = sessionStorage.getItem('report_photoUrl');
  const locationDataStr = sessionStorage.getItem('report_locationData');
  const locationData = locationDataStr ? JSON.parse(locationDataStr) : null;

  const [formData, setFormData] = useState({
    lokasi: locationData?.kecamatan?.nama_kecamatan ? `Kec. ${locationData.kecamatan.nama_kecamatan}` : 'Lokasi Terdeteksi',
    deskripsi: '',
  });

  useEffect(() => {
    if (!photoUrl || !locationData) {
      navigate('/');
    }
  }, [photoUrl, locationData, navigate]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (!formData.deskripsi.trim()) return;
    
    sessionStorage.setItem('report_formData', JSON.stringify(formData));
    sessionStorage.setItem('report_submitTime', new Date().toISOString());
    navigate('/report/preview');
  }, [formData, navigate]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCancel = useCallback(() => {
    sessionStorage.removeItem('report_photoUrl');
    sessionStorage.removeItem('report_locationData');
    navigate('/');
  }, [navigate]);

  if (!photoUrl || !locationData) return null;

  const kecamatanName = locationData.kecamatan?.nama_kecamatan;

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
      <div className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center gap-2 sticky top-0 z-10">
        <button onClick={handleBack} className="flex items-center gap-1 text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-slate-900 text-sm flex-1 text-center -ml-6">Detail Laporan</h1>
        <button onClick={handleCancel} className="text-red-500 text-xs font-semibold">Batal</button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-4 space-y-5 pb-8">
        <div className="relative rounded-2xl overflow-hidden bg-slate-200 h-48 shadow-inner">
          {photoUrl && <img src={photoUrl} alt="Bukti laporan" className="w-full h-full object-cover" loading="lazy" />}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> GPS Terkunci
            </span>
          </div>
        </div>

        {kecamatanName && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Kecamatan Terdeteksi</p>
              <p className="text-sm font-bold text-blue-700">{kecamatanName}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
              Deskripsi Kerusakan
            </label>
            <textarea
              rows={5}
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Jelaskan detail kerusakan yang Anda temukan..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-xs"
            />
          </div>
        </div>
      </form>

      <div className="bg-white border-t border-slate-100 p-4 sticky bottom-0 z-20">
        <button
          onClick={handleSubmit}
          disabled={!formData.deskripsi.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pratinjau Laporan
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}