import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, MapPin, FileStack, Clock3, CheckCircle2,
  Route as RouteIcon, Lightbulb, Waves, Trash2, Trees, Building2, GraduationCap,
  Signpost, Bus, Trophy, ShoppingBag, Landmark, ShieldCheck, Store,
  ChevronRight,
} from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import WeeklyChart from '../components/mobile/WeeklyChart';
import { MOCK_HOME_STATS, MOCK_WEEKLY_CHART, MOCK_MONTHLY_CHART, DETAILED_FACILITY_DATA, INITIAL_REPORTS } from '../utils/mockData';
import { KATEGORI_FASILITAS_ARRAY } from '../utils/kategoriFasilitas';

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

const STAT_ICONS = [FileStack, Clock3, CheckCircle2];

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
  const latestReport = INITIAL_REPORTS[0];

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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-blue-600" />
          </button>
        </div>

        <div className="relative">
          <h1 className="text-white text-xl font-bold leading-snug">
            Selamat datang, 
          </h1>
          <div className="flex items-center gap-1.5 mt-2 text-blue-100 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kabupaten Lamongan, Jawa Timur</span>
          </div>
        </div>
      </header>

      {/* Stats cards - overlapping header */}
      <div className="relative -mt-8 px-5">
        <div className="grid grid-cols-3 gap-3">
          {MOCK_HOME_STATS.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{stat.value}</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{stat.label}</p>
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
          <WeeklyChart data={range === 'mingguan' ? MOCK_WEEKLY_CHART : MOCK_MONTHLY_CHART} />
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
          {INITIAL_REPORTS.slice(0, 5).map((report) => (
            <Link
              key={report.id}
              to="/tracking"
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex gap-3 items-center"
            >
              <img
                src={report.foto}
                alt={report.judul}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">{report.judul}</p>
                </div>
                <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[report.status]}`}>
                  {report.status}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{report.kecamatan}, Lamongan</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{timeAgo(report.tanggal)}</p>
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
