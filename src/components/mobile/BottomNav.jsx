import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Camera, Map, User, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import { takePhoto, getCurrentLocation } from '../../services/capacitor';
import { findKecamatanByCoords } from '../../utils/kecamatan';

function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [gpsModalOpen, setGpsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Beranda' },
    { to: '/tracking', icon: ClipboardList, label: 'Laporan' },
    { to: '/report', icon: Camera, label: 'Lapor', isCenter: true },
    { to: '/map', icon: Map, label: 'Peta' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  const handleCameraClick = useCallback(async () => {
    if (processing) return;
    setProcessing(true);

    const toastId = toast.loading('Mengambil foto...');
    try {
      // 1. Take photo
      const photo = await takePhoto();
      if (!photo?.webPath) {
        toast.dismiss(toastId);
        setProcessing(false);
        return;
      }
      toast.loading('Mendeteksi lokasi GPS...', { id: toastId });

      // 2. Get GPS (wajib)
      const pos = await getCurrentLocation(true);
      if (!pos) {
        toast.dismiss(toastId);
        setGpsModalOpen(true);
        setProcessing(false);
        return;
      }

      // 3. Detect kecamatan
      const kecamatan = await findKecamatanByCoords(
        pos.coords.latitude,
        pos.coords.longitude
      );

      // 4. Save to sessionStorage
      sessionStorage.setItem('report_photoUrl', photo.webPath);
      sessionStorage.setItem('report_locationData', JSON.stringify({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        kecamatan,
        region: kecamatan?.nama_kecamatan || 'Lokasi Terdeteksi'
      }));

      toast.success('Foto & lokasi tersimpan', { id: toastId });
      navigate('/report/form');
    } catch (e) {
      console.error('Camera/GPS error:', e);
      toast.error('Gagal memulai laporan', { id: toastId });
    } finally {
      setProcessing(false);
    }
  }, [navigate, processing]);

  const handleGpsSettings = useCallback(() => {
    setGpsModalOpen(false);
  }, []);

  const handleGpsCancel = useCallback(() => {
    setGpsModalOpen(false);
  }, []);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-[1000] max-w-[430px] mx-auto">
        <div className="bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] px-2 pt-3 pb-[calc(0.4rem+env(safe-area-inset-bottom))] relative">
          <div className="flex items-end justify-between">
            {navItems.map(({ to, icon: Icon, label, isCenter }) => {
              const active = pathname === to;

              if (isCenter) {
                return (
                  <div key={to} className="flex-1 flex justify-center">
                    <button
                      onClick={handleCameraClick}
                      disabled={processing}
                      className="flex flex-col items-center disabled:opacity-50"
                    >
                      <span className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-600/50 ring-4 ring-white -mt-10 transition-transform active:scale-95">
                        {processing ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Icon className="w-5 h-5 text-white" />
                        )}
                      </span>
                    </button>
                  </div>
                );
              }

              return (
                <Link
                  key={to}
                  to={to}
                  className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl"
                >
                  <Icon
                    className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-[11px] font-medium ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <Modal
        isOpen={gpsModalOpen}
        onClose={handleGpsCancel}
        title="Lokasi Wajib Diaktifkan"
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Izin Lokasi Diperlukan</h3>
            <p className="text-slate-500 text-sm mt-2">
              Aplikasi memerlukan akses lokasi GPS untuk melaporkan kerusakan fasilitas. 
              Silakan aktifkan izin lokasi di pengaturan HP Anda.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleGpsCancel}
              className="flex-1 border border-slate-300 text-slate-600 py-2.5 rounded-xl font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleGpsSettings}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BottomNav;