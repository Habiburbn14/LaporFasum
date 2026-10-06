import React, { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut,
  Bell, TrendingUp, FileText, Clock, CheckCircle2, AlertCircle, Calendar
} from 'lucide-react';
import { INITIAL_REPORTS, MOCK_WEEKLY_CHART, MOCK_MONTHLY_CHART, MOCK_FACILITY_CATEGORIES } from '../utils/mockData';
import WeeklyChart from '../components/mobile/WeeklyChart';
import { useNavigate } from 'react-router-dom';

function AnalyticsPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('mingguan');
  const [reports] = useState([...INITIAL_REPORTS, ...INITIAL_REPORTS.slice(0, 4)]);

  const chartData = timeRange === 'mingguan' ? MOCK_WEEKLY_CHART : MOCK_MONTHLY_CHART;

  const stats = {
    total: reports.length,
    menunggu: reports.filter(r => r.status === 'Menunggu Verifikasi').length,
    diproses: reports.filter(r => r.status === 'Diterima').length,
    selesai: reports.filter(r => r.status === 'Selesai').length,
  };

  const categoryStats = MOCK_FACILITY_CATEGORIES.slice(0, 6).map(cat => {
    const count = reports.filter(r => r.kategori === cat.nama).length;
    return {
      nama: cat.nama,
      count,
      percentage: reports.length > 0 ? ((count / reports.length) * 100).toFixed(1) : 0,
      color: cat.color
    };
  }).sort((a, b) => b.count - a.count);

  const kecamatanStats = [
    { nama: 'Lamongan', count: 3 },
    { nama: 'Sambirejo', count: 2 },
    { nama: 'Mantup', count: 2 },
    { nama: 'Sugio', count: 1 },
    { nama: 'Glagah', count: 1 },
    { nama: 'Paciran', count: 1 }
  ];

  const getColorClass = (color) => {
    const colors = {
      'orange': 'bg-orange-100 text-orange-700',
      'amber': 'bg-amber-100 text-amber-700',
      'cyan': 'bg-cyan-100 text-cyan-700',
      'emerald': 'bg-emerald-100 text-emerald-700',
      'blue': 'bg-blue-100 text-blue-700',
      'violet': 'bg-violet-100 text-violet-700',
    };
    return colors[color] || 'bg-slate-100 text-slate-700';
  };

  const getBarColor = (color) => {
    const colors = {
      'orange': 'bg-orange-500',
      'amber': 'bg-amber-500',
      'cyan': 'bg-cyan-500',
      'emerald': 'bg-emerald-500',
      'blue': 'bg-blue-500',
      'violet': 'bg-violet-500',
    };
    return colors[color] || 'bg-slate-500';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
            L
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">LaporFasum</h2>
            <p className="text-xs text-slate-400">Lamongan Admin</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button onClick={() => navigate('/admin/master')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button onClick={() => navigate('/admin/triage')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
            <ClipboardList className="w-5 h-5" />
            Triage Reports
          </button>
          <button onClick={() => navigate('/admin/gis')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
            <Map className="w-5 h-5" />
            GIS Map View
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button onClick={() => navigate('/admin/settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate('/admin-login')}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-red-400 font-medium text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
              <p className="text-xs text-slate-500">Laporan dan statistik mendalam</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="Admin"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">Admin Kabupaten</p>
                <p className="text-[11px] text-slate-500">Dinas PUPR Lamongan</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 space-y-8 max-w-[1400px] w-full mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Laporan</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
              <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ +12% dari bulan lalu</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menunggu</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{stats.menunggu}</p>
              <span className="text-xs text-amber-600 font-medium mt-1 inline-block">! Perlu Verifikasi</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diproses</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.diproses}</p>
              <span className="text-xs text-blue-600 font-medium mt-1 inline-block">Tim Aktif</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selesai</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.selesai}</p>
              <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">96% Tepat Waktu</span>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Tren Volume Laporan</h2>
                <p className="text-xs text-slate-500 mt-0.5">Statistik pengaduan infrastruktur di Kabupaten Lamongan</p>
              </div>
              <div className="flex bg-slate-100 rounded-full p-1">
                <button 
                  onClick={() => setTimeRange('mingguan')}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${timeRange === 'mingguan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Mingguan
                </button>
                <button 
                  onClick={() => setTimeRange('bulanan')}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${timeRange === 'bulanan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Bulanan
                </button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <WeeklyChart data={chartData} width={800} height={220} />
            </div>
          </div>

          {/* Category & Location Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Category */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Laporan per Kategori</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Distribusi berdasarkan jenis kerusakan</p>
                </div>
              </div>
              <div className="space-y-4">
                {categoryStats.map((cat, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getColorClass(cat.color)}`}>
                        {cat.nama}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{cat.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getBarColor(cat.color)}`}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Location */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Laporan per Kecamatan</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Distribusi berdasarkan wilayah</p>
                </div>
              </div>
              <div className="space-y-3">
                {kecamatanStats.map((kec, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{kec.nama}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{kec.count}</p>
                      <p className="text-xs text-slate-400">laporan</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6" />
              <div>
                <h2 className="font-bold text-base">Ringkasan Periode Ini</h2>
                <p className="text-xs text-blue-100 mt-0.5">1 - 30 September 2026</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-xs text-blue-100 mb-1">Rata-rata Waktu Respon</p>
                <p className="text-2xl font-bold">2.3 hari</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-xs text-blue-100 mb-1">Tingkat Penyelesaian</p>
                <p className="text-2xl font-bold">96%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-xs text-blue-100 mb-1">Kepuasan Warga</p>
                <p className="text-2xl font-bold">4.7/5.0</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AnalyticsPage;
