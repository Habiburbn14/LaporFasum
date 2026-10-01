import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Zap, Camera, ArrowLeft, MapPin, Send, CheckCircle2, Clock, Loader2 } from 'lucide-react';

function CameraStep({ onCapture, onClose }) {
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col max-w-[430px] mx-auto">
      <div className="flex items-center justify-between px-5 pt-6">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <X className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white font-semibold text-sm">Kamera Pelaporan</h1>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <Zap className="w-4.5 h-4.5 text-white" size={18} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-8">
        <div className="aspect-square w-full max-w-xs border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center gap-3 px-6">
          <Camera className="w-10 h-10 text-white/50 animate-pulse" />
          <p className="text-white/60 text-sm text-center leading-relaxed">
            Membuka kamera...
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onCapture(file);
        }}
      />
    </div>
  );
}

function DetailFormStep({ photoUrl, onBack, onSubmit }) {
  const [formData, setFormData] = React.useState({
    lokasi: '',
    kategori: '',
    deskripsi: '',
  });

  React.useEffect(() => {
    // Simulasi deteksi AI backend
    const timer = setTimeout(() => {
      setFormData({
        lokasi: 'Jl. Basuki Rahmat, Lamongan (Auto-Detected by AI)',
        kategori: 'Jalan dan Jembatan',
        deskripsi: 'Kerusakan terdeteksi oleh AI: Lubang pada badan jalan dengan diameter ±50cm.',
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.lokasi || !formData.kategori || !formData.deskripsi) return;
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex flex-col">
      <div className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center gap-2 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-600">
          <ArrowLeft className="w-4.5 h-4.5" size={18} />
        </button>
        <h1 className="font-semibold text-slate-900 text-sm flex-1 text-center -ml-6">Detail Laporan (AI Detected)</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-4 space-y-5 pb-28">
        <div className="relative rounded-2xl overflow-hidden bg-slate-200 h-48">
          {photoUrl && <img src={photoUrl} alt="Bukti laporan" className="w-full h-full object-cover" />}
          <span className="absolute bottom-3 right-3 bg-emerald-600 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            AI: Lokasi Terdeteksi
          </span>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Lokasi Kejadian (AI Detected)
          </label>
          <input
            type="text"
            readOnly
            value={formData.lokasi}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-100 text-slate-700 cursor-not-allowed outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
            Kategori Fasilitas (AI Detected)
          </label>
          <input
            type="text"
            readOnly
            value={formData.kategori}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-100 text-slate-700 cursor-not-allowed outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
            Deskripsi Kerusakan (AI Detected)
          </label>
          <textarea
            rows={5}
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            placeholder="Tambahkan detail tambahan jika perlu..."
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          />
        </div>
      </form>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-slate-100 p-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-3 flex items-center justify-center gap-2 text-sm"
        >
          Preview Laporan
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
function PreviewStep({ 
  photoUrl, 
  formData, 
  timestamp, 
  coordinates, 
  onEdit, 
  onSubmit,
  isSubmitting
}) {
  const formatDate = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${dayName}, ${day} ${month} ${year} - ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28">
      <div className="bg-white border-b border-slate-100 px-4 py-3.5 sticky top-0 z-10">
        <h1 className="font-semibold text-slate-900 text-sm text-center">Validasi Laporan</h1>
      </div>

      <div className="p-4">
        <img src={photoUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl shadow-sm" />
      </div>

      <div className="px-4 space-y-4 pb-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Lokasi Kejadian</label>
            <p className="text-sm font-medium text-slate-800 mt-1">{formData.lokasi}</p>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Kategori</label>
            <p className="text-sm font-medium text-slate-800 mt-1">{formData.kategori}</p>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Deskripsi</label>
            <p className="text-sm text-slate-800 mt-1">{formData.deskripsi}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Waktu</label>
              <p className="text-xs text-slate-600 mt-1">{formatDate(timestamp)}</p>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> Koordinat</label>
              <p className="text-xs text-slate-600 mt-1">{coordinates.lat}, {coordinates.lng}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-slate-100 p-4 grid grid-cols-2 gap-3">
        <button 
          onClick={onEdit}
          disabled={isSubmitting}
          className="text-slate-600 font-medium rounded-xl py-3 text-sm border border-slate-200 disabled:opacity-50"
        >
          Edit Laporan
        </button>
        <button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-medium rounded-xl py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kirim Final'}
        </button>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 max-w-[430px] mx-auto bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-slate-800">Mengirim laporan...</p>
          </div>
        </div>
      )}
    </div>
  );
}
function SuccessStep({ ticketId, onDone }) {
  return (
    <div className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col items-center justify-center px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">Laporan Berhasil Terkirim!</h1>
      <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-5">
        Terima kasih telah berpartisipasi melaporkan fasilitas umum. Laporan Anda akan segera ditinjau oleh dinas terkait.
      </p>
      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full mb-10">
        # ID Laporan {ticketId}
      </span>
      <button
        onClick={onDone}
        className="w-full border-2 border-blue-600 text-blue-600 font-medium rounded-xl py-3 text-sm"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}

function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = React.useState(location.state?.photoUrl ? 'form' : 'camera');
  const [photoUrl, setPhotoUrl] = React.useState(location.state?.photoUrl || null);
  const [ticketId, setTicketId] = React.useState('');
  const [reportData, setReportData] = React.useState(null);
  const [submitTime, setSubmitTime] = React.useState(null);
  const [gpsCoords, setGpsCoords] = React.useState({ lat: -6.8938, lng: 112.2140 });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (location.state?.photoUrl) {
      setPhotoUrl(location.state.photoUrl);
      setStep('form');
    }
  }, [location.state]);

  const handleCapture = (file) => {
    setPhotoUrl(URL.createObjectURL(file));
    setStep('form');
  };

  const handleFormSubmit = (formData) => {
    setReportData(formData);
    setSubmitTime(new Date());
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            lat: position.coords.latitude.toFixed(4),
            lng: position.coords.longitude.toFixed(4)
          });
        },
        (error) => {
          console.log('GPS tidak tersedia, menggunakan koordinat default Lamongan');
        }
      );
    }
    
    setStep('preview');
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const id = `LPF-${new Date().getFullYear()}${String(Math.floor(Math.random() * 90000) + 10000)}`;
    setTicketId(id);
    setIsSubmitting(false);
    setStep('success');
  };

  const handleEdit = () => {
    setStep('form');
  };

  if (step === 'camera') {
    return <CameraStep onCapture={handleCapture} onClose={() => navigate('/')} />;
  }
  if (step === 'form') {
    return <DetailFormStep photoUrl={photoUrl} onBack={() => navigate('/')} onSubmit={handleFormSubmit} />;
  }
  if (step === 'preview') {
    return (
      <PreviewStep 
        photoUrl={photoUrl}
        formData={reportData}
        timestamp={submitTime}
        coordinates={gpsCoords}
        onEdit={handleEdit}
        onSubmit={handleFinalSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }
  return <SuccessStep ticketId={ticketId} onDone={() => navigate('/')} />;
}

export default ReportPage;
