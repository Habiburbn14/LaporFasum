import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Send, ChevronDown, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const KECAMATAN_LIST = [
  'Sukorame', 'Bluluk', 'Modo', 'Ngimbang', 'Babat', 'Kedungpring',
  'Brondong', 'Laren', 'Sekaran', 'Maduran', 'Sambeng', 'Sugio',
  'Pucuk', 'Paciran', 'Solokuro', 'Mantup', 'Sukodadi', 'Karanggeneng',
  'Kembangbahu', 'Kalitengah', 'Turi', 'Lamongan', 'Tikung',
  'Karangbinangun', 'Deket', 'Glagah', 'Sarirejo'
];

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

  const [showKecamatanPicker, setShowKecamatanPicker] = useState(false);
  const [manualKecamatan, setManualKecamatan] = useState(locationData?.kecamatan?.nama_kecamatan || '');

  const handleKecamatanSelect = (kecamatan) => {
    setManualKecamatan(kecamatan);
    setFormData(prev => ({ ...prev, lokasi: `Kec. ${kecamatan}` }));
    setShowKecamatanPicker(false);
  };

  const handleRedetect = async () => {
    toast.loading('Mendeteksi ulang lokasi...', { id: 'redetect-gps' });
    try {
      const { getCurrentLocation } = await import('../../services/capacitor');
      const { findKecamatanByCoords } = await import('../../utils/kecamatan');
      const pos = await getCurrentLocation(true);
      if (pos) {
        const kecamatan = await findKecamatanByCoords(pos.coords.latitude, pos.coords.longitude);
        if (kecamatan) {
          setManualKecamatan(kecamatan.nama_kecamatan);
          setFormData(prev => ({ ...prev, lokasi: `Kec. ${kecamatan.nama_kecamatan}` }));
          // Update sessionStorage
          const newLocationData = {
            ...locationData,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            kecamatan,
            region: kecamatan.nama_kecamatan
          };
          sessionStorage.setItem('report_locationData', JSON.stringify(newLocationData));
          toast.success(`Lokasi diperbarui: ${kecamatan.nama_kecamatan}`, { id: 'redetect-gps' });
        } else {
          toast.error('Tidak dapat mendeteksi kecamatan', { id: 'redetect-gps' });
        }
      } else {
        toast.error('GPS gagal', { id: 'redetect-gps' });
      }
    } catch (e) {
      toast.error('Gagal mendeteksi lokasi', { id: 'redetect-gps' });
    }
  };

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

        {/* Manual Kecamatan Selector - Fallback if GPS is wrong */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block flex items-center justify-between">
            Kecamatan Laporan
            <span className="text-[10px] text-amber-600 font-normal">Bisa diubah jika salah</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKecamatanPicker(true)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-left flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span className="text-slate-900 font-medium">
                  {formData.lokasi.replace('Kec. ', '') || 'Pilih kecamatan...'}
                </span>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={handleRedetect}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
              title="Deteksi Ulang Lokasi GPS"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          {locationData?.accuracy && (
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Akurasi GPS: ±{Math.round(locationData.accuracy)}m
            </p>
          )}
        </div>

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

      {/* Kecamatan Picker Modal */}
      {showKecamatanPicker && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center z-[1500]">
          <div className="w-full max-h-[80vh] bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="font-bold text-slate-900">Pilih Kecamatan</h3>
              <button
                onClick={() => setShowKecamatanPicker(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-4 space-y-1">
              {KECAMATAN_LIST.map((kec) => (
                <button
                  key={kec}
                  onClick={() => handleKecamatanSelect(kec)}
                  className={`w-full px-4 py-3 rounded-xl text-left font-medium border transition-all ${
                    manualKecamatan === kec
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {kec}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}