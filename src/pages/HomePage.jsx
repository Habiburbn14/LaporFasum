import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, MapPin, FileStack, Clock3, CheckCircle2,
  Route as RouteIcon, Lightbulb, Waves, Trash2, Trees, Building2, GraduationCap,
  Signpost, Bus, Trophy, ShoppingBag, Landmark, ShieldCheck, Store,
  ChevronRight,
} from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import WeeklyChart from '../components/mobile/WeeklyChart';
import { MOCK_HOME_STATS, MOCK_WEEKLY_CHART, MOCK_MONTHLY_CHART, DETAILED_FACILITY_DATA } from '../utils/mockData';
import { KATEGORI_FASILITAS_ARRAY } from '../utils/kategoriFasilitas';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = {
  jalan: RouteIcon,
  pju: Lightbulb,
  drainase: Waves,
  sampah: Trash2,
  taman: Trees,
  kesehatan: Building2,
  pendidikan: GraduationCap,
  rambu: Signpost,
  transportasi: Bus,
  olahraga: Trophy,
  pasar: ShoppingBag,
  ibadah: Landmark,
  pemerintah: Landmark,
  keamanan: ShieldCheck,
  perbelanjaan: Store,
};

const CATEGORY_COLORS = {
  blue: 'bg-blue-50 text-blue-600',
  violet: 'bg-violet-50 text-violet-600',
  orange: 'bg-orange-50 text-orange-600',
  amber: 'bg-amber-50 text-amber-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  pink: 'bg-pink-50 text-pink-600',
};

const STATUS_STYLES = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700',
  Diterima: 'bg-blue-100 text-blue-700',
  Selesai: 'bg-emerald-100 text-emerald-700',
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Baru saja';
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

function HomePage() {
  const [range, setRange] = React.useState('mingguan');
  const { user, loading: authLoading } = useAuth();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  
  const [dashboardData, setDashboardData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setDataLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${baseUrl}/dashboard/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error(error.response?.data?.detail || 'Gagal memuat data dashboard');
        setDashboardData(null);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, baseUrl]);

  const formatChartData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => {
      let label = '';
      if (item.tanggal) {
        const d = new Date(item.tanggal);
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        label = days[d.getDay()];
      } else if (item.minggu) {
        label = `W${String(item.minggu).slice(-2)}`;
      } else if (item.bulan) {
        const [y, m] = String(item.bulan).split('-');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        label = monthNames[parseInt(m) - 1] || m;
      }
      
      return {
        label: label || item.label || '',
        value: item.jumlah || 0
      };
    });
  };

  const getWeeklyData = () => {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const harianData = dashboardData?.statistik_harian || [];
    
    // Create map of tanggal -> jumlah
    const dataMap = {};
    harianData.forEach(item => {
      if (item.tanggal) {
        const d = new Date(item.tanggal);
        const dayName = days[(d.getDay() + 6) % 7]; // Adjust so Monday = 0
        dataMap[dayName] = item.jumlah || 0;
      }
    });
    
    // Return 7 days with 0 for missing days
    return days.map(day => ({
      label: day,
      value: dataMap[day] || 0
    }));
  };

  const getMonthlyData = () => {
    const bulananData = dashboardData?.statistik_bulanan || [];
    return formatChartData(bulananData);
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-107.5 mx-auto pb-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-blue-200 animate-pulse mx-auto mb-4"></div>
          <p className="text-slate-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 max-w-107.5 mx-auto pb-28">
      {user && (
        <>
        
        {/* Header */}
        <header className="bg-linear-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-6 pb-14 rounded-b-3xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/5 rounded-full" />

          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-white">
                L
              </div>
              <span className="text-white font-semibold text-lg">LaporFasum</span>
            </div>
            <button className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Bell className="w-4.5 h-4.5 text-white" size={18} />
              {(dashboardData?.notifikasi || []).filter(n => !n.is_read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-blue-600" />
              )}
            </button>
          </div>

          <div className="relative">
            <h1 className="text-white text-xl font-bold leading-snug">
              Selamat datang, {user.nama_lengkap || 'Warga lamongan'}
            </h1>
            <div className="flex items-center gap-1.5 mt-2 text-blue-100 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>Kabupaten Lamongan, Jawa Timur</span>
            </div>
          </div>
        </header>

        <div className="relative -mt-8 px-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                <FileStack className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-slate-900 leading-tight">
                {dashboardData?.statistik_wilayah?.total_laporan || 0}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Total Laporan</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                <Clock3 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-slate-900 leading-tight">
                {dashboardData?.statistik_wilayah?.diproses || 0}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Diproses</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-slate-900 leading-tight">
                {dashboardData?.statistik_wilayah?.selesai || 0}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Selesai</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-5 mt-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-900 text-sm">Total Laporan Masuk</h2>
                <p className="text-xs text-slate-400 mt-0.5">{range === 'mingguan' ? 'Statistik seminggu terakhir' : 'Statistik sebulan terakhir'}</p>
              </div>
              <div className="flex bg-slate-100 rounded-full p-0.5">
                {['mingguan', 'bulanan'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize transition-colors ${
                      range === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
             <WeeklyChart data={range === 'mingguan' 
                ? getWeeklyData()
                : getMonthlyData()} />
          </div>
        </div>

        {/* Kategori Fasilitas */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900 text-sm">Kategori Fasilitas</h2>
            <Link to="/fasilitas" className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {KATEGORI_FASILITAS_ARRAY.slice(0, 6).map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon];
              return (
                <Link
                  key={cat.id_kategori}
                  to={`/fasilitas/${cat.id_kategori}`}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex flex-col items-center gap-2 hover:border-blue-200 transition-colors"
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${CATEGORY_COLORS[cat.color]}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{cat.nama_kategori}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Laporan Terbaru */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900 text-sm">Laporan Terbaru</h2>
            <Link to="/tracking" className="text-xs text-blue-600 font-medium">
              Riwayat
            </Link>
          </div>
          <div className="space-y-3">
            {(dashboardData?.laporan_terbaru || []).length > 0 ? (
              dashboardData.laporan_terbaru.slice(0, 5).map((report) => (
                <Link
                  key={report.id_laporan}
                  to="/tracking"
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex gap-3 items-center"
                >
                  <img
                    src={report.foto_bukti || 'https://via.placeholder.com/64'}
                    alt={report.judul_laporan}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{report.judul_laporan}</p>
                    </div>
                    <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[report.status_terkini] || 'bg-slate-100 text-slate-700'}`}>
                      {report.status_terkini}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{report.nama_kecamatan || 'Lamongan'}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(report.waktu_lapor)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">Belum ada laporan</p>
              </div>
            )}
          </div>
        </div>

        <BottomNav />

        </>
      )}
    </div>
  );
}

export default HomePage;
