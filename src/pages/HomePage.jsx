import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell, MapPin, FileStack, Clock3, CheckCircle2,
  Building2, Route as RouteIcon, Lightbulb, Waves, Trees,
  ChevronRight,
} from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import WeeklyChart from '../components/mobile/WeeklyChart';

// Pemetaan 6 Kategori Teratas
const TOP_CATEGORIES = [
  { id: 1, nama: 'Jalan & Jembatan', icon: RouteIcon, color: 'bg-blue-50 text-blue-600' },
  { id: 2, nama: 'PJU', icon: Lightbulb, color: 'bg-amber-50 text-amber-600' },
  { id: 3, nama: 'Drainase', icon: Waves, color: 'bg-cyan-50 text-cyan-600' },
  { id: 4, nama: 'Kebersihan', icon: FileStack, color: 'bg-orange-50 text-orange-600' },
  { id: 5, nama: 'Taman & RTH', icon: Trees, color: 'bg-emerald-50 text-emerald-600' },
  { id: 6, nama: 'Faskes', icon: Building2, color: 'bg-violet-50 text-violet-600' },
];

const STAT_ICONS = [FileStack, Clock3, CheckCircle2];

const STATUS_STYLES = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700',
  'Diterima': 'bg-blue-100 text-blue-700',
  'Sedang Diproses': 'bg-purple-100 text-purple-700',
  'Selesai': 'bg-emerald-100 text-emerald-700',
  'Ditolak': 'bg-red-100 text-red-700',
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Baru saja';
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

function HomePage() {
  const [range, setRange] = useState('mingguan');
  const [stats, setStats] = useState([]);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const [dashboardRes, notificationsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BASE_URL}/dashboard/user`, { headers, signal: controller.signal }),
        fetch(`${import.meta.env.VITE_BASE_URL}/dashboard/notifikasi`, { headers, signal: controller.signal })
      ]);

      clearTimeout(timeoutId);

      const dashboardData = await dashboardRes.json();
      const notificationsData = await notificationsRes.json();

      // Mapping manual untuk statistik wilayah dari JSON backend
      const rawStats = dashboardData.statistik_wilayah || {};
      const formattedStats = [
        { label: 'Total Laporan', value: rawStats.total_laporan || 0 },
        { label: 'Diproses', value: rawStats.diproses || 0 },
        { label: 'Selesai', value: rawStats.selesai || 0 }
      ];

      setStats(formattedStats);
      setWeeklyChartData(dashboardData.statistik_harian || []);
      setMonthlyChartData(dashboardData.statistik_mingguan || []);
      setRecentReports(dashboardData.laporan_terbaru || []);
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-6 pb-14 rounded-b-3xl relative overflow-hidden">
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
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-blue-600" />
            )}
          </button>
        </div>

        <div className="relative">
          <h1 className="text-white text-xl font-bold leading-snug">
            Selamat datang, Warga Lamongan
          </h1>
          <div className="flex items-center gap-1.5 mt-2 text-blue-100 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kabupaten Lamongan, Jawa Timur</span>
          </div>
        </div>
      </header>

      {/* Stats cards */}
      <div className="relative -mt-8 px-5">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => {
            const Icon = STAT_ICONS[i] || FileStack;
            return (
              <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{stat.value}</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">{stat.label}</p>
              </div>
            );
          })}
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
          <WeeklyChart data={range === 'mingguan' ? weeklyChartData : monthlyChartData} />
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
          {TOP_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/fasilitas/${cat.id}`}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex flex-col items-center gap-2 hover:border-blue-200 transition-colors"
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{cat.nama}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Laporan Terbaru - Mapping disesuaikan dengan field backend */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900 text-sm">Laporan Terbaru</h2>
          <Link to="/tracking" className="text-xs text-blue-600 font-medium">
            Riwayat
          </Link>
        </div>
        <div className="space-y-3">
          {recentReports.slice(0, 5).map((report) => (
            <Link
              key={report.id_laporan}
              to={`/tracking/${report.id_laporan}`}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex gap-3 items-center"
            >
              <img
                src={report.foto_bukti}
                alt={report.judul_laporan}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
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
                  <span className="truncate">{report.nama_kecamatan}, Lamongan</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(report.waktu_lapor)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default HomePage;