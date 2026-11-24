import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Send, ChevronDown, RefreshCw, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCurrentLocation } from '../../services/capacitor';
import { findKecamatanByCoords } from '../../utils/kecamatan';
import { masterAPI } from '../../services/api';

// CSV order matches DB IDs (1-27)
const KECAMATAN_LIST = [
  'Babat', 'Bluluk', 'Brondong', 'Deket', 'Glagah', 'Kalitengah',
  'Karangbinangun', 'Karanggeneng', 'Kedungpring', 'Kembangbahu', 'Lamongan',
  'Laren', 'Maduran', 'Mantup', 'Modo', 'Ngimbang', 'Paciran', 'Pucuk',
  'Sambeng', 'Sarirejo', 'Sekaran', 'Solokuro', 'Sugio', 'Sukodadi',
  'Sukorame', 'Tikung', 'Turi'
];

// Map for ID lookup by name (handles case differences)
const KECAMATAN_ID_MAP = Object.fromEntries(
  KECAMATAN_LIST.map((name, i) => [name.toLowerCase(), i + 1])
);

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
  const [fasilitasRekomendasi, setFasilitasRekomendasi] = useState([]);
  const [selectedFasilitas, setSelectedFasilitas] = useState(null);
  const [loadingFasilitas, setLoadingFasilitas] = useState(false);

  // Fetch rekomendasi fasilitas when location is available
  useEffect(() => {
    if (locationData?.latitude && locationData?.longitude) {
      const fetchRekomendasi = async () => {
        setLoadingFasilitas(true);
        setFasilitasRekomendasi([]);
        try {
          const res = await masterAPI.getRekomendasiFasilitas(locationData.latitude, locationData.longitude);
          console.log('Rekomendasi API Response:', res);
          // Handle different response structures
          let rekomendasi = [];
          if (res.data?.rekomendasi) {
            rekomendasi = res.data.rekomendasi;
          } else if (res.data?.data) {
            rekomendasi = res.data.data;
          } else if (Array.isArray(res.data)) {
            rekomendasi = res.data;
          } else if (Array.isArray(res)) {
            rekomendasi = res;
          }
          if (rekomendasi.length > 0) {
            setFasilitasRekomendasi(rekomendasi);
          }
        } catch (err) {
          console.error('Gagal memuat rekomendasi fasilitas:', err);
          setFasilitasRekomendasi([]);
        } finally {
          setLoadingFasilitas(false);
        }
      };
      fetchRekomendasi();
    }
  }, [locationData?.latitude, locationData?.longitude]);

  const handleFasilitasSelect = (fasilitas) => {
    try {
      setSelectedFasilitas(fasilitas);
      setFormData(prev => ({ ...prev, id_fasilitas_umum: fasilitas.id_fasilitas, nama_fasilitas: fasilitas.nama_fasilitas }));
    } catch (err) {
      console.error('Error selecting fasilitas:', err);
    }
  };

  const handleKecamatanSelect = (kecamatan) => {
    // Use case-insensitive lookup for ID
    const kecamatanId = KECAMATAN_ID_MAP[kecamatan.toLowerCase()] || KECAMATAN_LIST.indexOf(kecamatan) + 1;
    
    console.log('[Select Kecamatan]', kecamatan, 'ID:', kecamatanId);
    
    setManualKecamatan(kecamatan);
    setFormData(prev => ({ ...prev, lokasi: `Kec. ${kecamatan}` }));
    setShowKecamatanPicker(false);
    
    // Update sessionStorage with selected kecamatan
    if (locationData) {
      const newLocationData = {
        ...locationData,
        kecamatan: {
          nama_kecamatan: kecamatan,
          id_kecamatan: kecamatanId
        },
        region: kecamatan
      };
      sessionStorage.setItem('report_locationData', JSON.stringify(newLocationData));
      console.log('[Select Kecamatan] Saved to sessionStorage:', newLocationData);
    }
  };

  const handleRedetect = async () => {
    toast.loading('Mendeteksi ulang lokasi...', { id: 'redetect-gps' });
    try {
      const pos = await getCurrentLocation(true);
      if (pos) {
        const kecamatan = await findKecamatanByCoords(pos.coords.latitude, pos.coords.longitude);
        if (kecamatan) {
          // Get ID using case-insensitive map
          const kecamatanName = kecamatan.nama_kecamatan || kecamatan.name || '';
          const kecamatanId = KECAMATAN_ID_MAP[kecamatanName.toLowerCase()] 
            || KECAMATAN_LIST.indexOf(kecamatanName) + 1;
          
          console.log('[Redetect] Detected kecamatan:', kecamatanName, 'ID:', kecamatanId);
          
          setManualKecamatan(kecamatanName);
          setFormData(prev => ({ ...prev, lokasi: `Kec. ${kecamatanName}` }));
          
          // Update sessionStorage with proper ID
          const newLocationData = {
            ...locationData,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            kecamatan: {
              nama_kecamatan: kecamatanName,
              id_kecamatan: kecamatanId
            },
            region: kecamatanName
          };
          sessionStorage.setItem('report_locationData', JSON.stringify(newLocationData));
          toast.success(`Lokasi diperbarui: ${kecamatanName}`, { id: 'redetect-gps' });
        } else {
          toast.error('Tidak dapat mendeteksi kecamatan', { id: 'redetect-gps' });
        }
      } else {
        toast.error('GPS gagal', { id: 'redetect-gps' });
      }
    } catch (e) {
      console.error('[Redetect] Error:', e);
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

        {/* Rekomendasi Fasilitas Terdekat */}
        {(fasilitasRekomendasi.length > 0 || loadingFasilitas) && (
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block flex items-center justify-between">
              Fasilitas Terdekat (500m)
              <span className="text-[10px] text-emerald-600 font-normal">Opsional - Pilih jika relevan</span>
            </label>
            {loadingFasilitas ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (Array.isArray(fasilitasRekomendasi) && fasilitasRekomendasi.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {fasilitasRekomendasi.map((item) => {
                  const fas = item;
                  return (
                    <button
                      key={fas.id_fasilitas}
                      type="button"
                      onClick={() => handleFasilitasSelect(fas)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-medium ${
                        selectedFasilitas?.id_fasilitas === fas.id_fasilitas
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200'
                      }`}
                    >
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate max-w-[160px]">
                        {fas.nama_fasilitas}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {Math.round(fas.jarak_meter)}m
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500 text-sm">
                Tidak ada fasilitas terdekat ditemukan
              </div>
            ))}
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