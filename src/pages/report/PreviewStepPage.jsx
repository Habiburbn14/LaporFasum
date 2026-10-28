import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Loader2, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/error';
import { uriToFile } from '../../services/capacitor';
import { uploadLaporan } from '../../services/upload.js';

export default function PreviewStepPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const photoUrl = sessionStorage.getItem('report_photoUrl');
  const locationDataStr = sessionStorage.getItem('report_locationData');
  const formDataStr = sessionStorage.getItem('report_formData');
  const submitTimeStr = sessionStorage.getItem('report_submitTime');

  const locationData = locationDataStr ? JSON.parse(locationDataStr) : null;
  const formData = formDataStr ? JSON.parse(formDataStr) : null;
  const submitTime = submitTimeStr ? new Date(submitTimeStr) : new Date();

  const gpsCoords = useMemo(() => 
    locationData ? { lat: locationData.latitude, lng: locationData.longitude } : { lat: -6.8938, lng: 112.2140 },
    [locationData]
  );

  useEffect(() => {
    if (!photoUrl || !locationData || !formData) {
      navigate('/');
    }
  }, [photoUrl, locationData, formData, navigate]);

  const formatDate = useCallback((date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${dayName}, ${day} ${month} ${year} - ${hours}:${minutes}`;
  }, []);

const handleFinalSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Mengirim laporan...');
    
    try {
      // Convert photo URI to compressed File
      let file = await uriToFile(photoUrl, 'bukti-laporan', 1200, 0.7);
      if (!file) {
        throw new Error('Foto bukti tidak valid. Silakan ambil ulang foto.');
      }

      const kecamatanNama = locationData?.kecamatan?.nama_kecamatan || '';
      const lokasiTeks = formData?.lokasi || kecamatanNama || '';
      const judul = `Kerusakan Fasilitas di ${lokasiTeks || 'Lamongan'}`;

      const formDataObj = new FormData();
      formDataObj.append('judul_laporan', judul);
      formDataObj.append('deskripsi', formData?.deskripsi || '');
      formDataObj.append('latitude', String(locationData?.latitude ?? gpsCoords.lat));
      formDataObj.append('longitude', String(locationData?.longitude ?? gpsCoords.lng));
      if (locationData?.kecamatan?.id_kecamatan) {
        formDataObj.append('id_kecamatan_kejadian', String(locationData.kecamatan.id_kecamatan));
      }
      formDataObj.append('foto_bukti', file);

      const data = await uploadLaporan(formDataObj);
      const id =
        data.kode_tiket ||
        data.ticket_code ||
        data.data?.kode_tiket ||
        data.data?.ticket_code ||
        data.id_laporan ||
        `LPF-${Date.now()}`;

      sessionStorage.setItem('report_ticketId', id);
      toast.success('Laporan berhasil dikirim!', { id: toastId });
      navigate('/report/success');
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      toast.error(errorMsg, { id: toastId, duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, photoUrl, locationData, formData, gpsCoords, navigate]);

  const handleEdit = useCallback(() => {
    navigate('/report/form');
  }, [navigate]);

  if (!photoUrl || !locationData || !formData) return null;

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
      <div className="bg-white border-b border-slate-100 px-4 py-3.5 sticky top-0 z-10">
        <h1 className="font-semibold text-slate-900 text-sm text-center">Pratinjau Laporan</h1>
      </div>

      <div className="p-4">
        <img src={photoUrl} alt="Preview" className="w-full h-52 object-cover rounded-xl shadow-sm" loading="lazy" />
      </div>

      <div className="px-4 space-y-4 pb-8">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Foto Terverifikasi</p>
              <p className="text-xs text-green-700 mt-0.5">Bukti foto & lokasi GPS terkunci otomatis</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Lokasi</label>
              <p className="text-sm font-medium text-slate-800 mt-1">{formData.lokasi}</p>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400">Deskripsi</label>
              <p className="text-sm text-slate-800 mt-1">{formData.deskripsi}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Waktu
                </label>
                <p className="text-xs text-slate-600 mt-1">{formatDate(submitTime)}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Koordinat
                </label>
                <p className="text-xs text-slate-600 mt-1">{gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}</p>
              </div>
            </div>
          </div>

          {locationData.kecamatan && (
            <div className="pt-3 border-t border-slate-100">
              <label className="text-[10px] uppercase font-bold text-slate-400">Kecamatan</label>
              <p className="text-sm font-bold text-blue-600 mt-1">{locationData.kecamatan.nama_kecamatan}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 p-4 sticky bottom-0 z-20 grid grid-cols-2 gap-3">
        <button 
          onClick={handleEdit}
          disabled={isSubmitting}
          className="text-slate-600 font-medium rounded-xl py-3 text-sm border border-slate-200 disabled:opacity-50"
        >
          Edit Laporan
        </button>
        <button 
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm disabled:opacity-70 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kirim Final
            </>
          )}
        </button>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 max-w-[430px] mx-auto bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-slate-800">Mengirim laporan ke server...</p>
          </div>
        </div>
      )}
    </div>
  );
}