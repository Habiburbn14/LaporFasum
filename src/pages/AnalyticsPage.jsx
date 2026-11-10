import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, FileText, Clock, CheckCircle2, AlertCircle, Calendar,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { MOCK_WEEKLY_CHART, MOCK_MONTHLY_CHART, MOCK_FACILITY_CATEGORIES } from '../utils/mockData';
import WeeklyChart from '../components/mobile/WeeklyChart';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useLaporanList } from '../hooks/useLaporanList';
import { adminAPI } from '../services/api';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorState from '../components/ui/ErrorState';
import NotificationPopup from '../components/ui/NotificationPopup';
import AdminSidebar from '../components/AdminSidebar';
import LogoutConfirm from '../components/ui/LogoutConfirm';

function AnalyticsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { reports, loading, error, reload } = useLaporanList();
  const [timeRange, setTimeRange] = useState('mingguan');
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [periodSummary, setPeriodSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [kategoriStats, setKategoriStats] = useState([]);
  const [kecamatanStats, setKecamatanStats] = useState([]);
  const [showAllCat, setShowAllCat] = useState(false);
  const [showAllKec, setShowAllKec] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => setLogoutOpen(true);

  const confirmLogout = () => {
    logout();
    navigate('/admin-login');
    setLogoutOpen(false);
  };

  const cancelLogout = () => setLogoutOpen(false);

  const transformToChartFormat = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => ({
      label: item.label || item.tanggal || item.periode || item.hari || item.bulan || item.nama_kecamatan || item.nama || '',
      value: Number(item.value || item.jumlah || item.total || item.count || 0)
    })).filter(item => item.label && !isNaN(item.value) && item.label !== '');
  };

  const numberify = (v) => Number(v) || 0;

  const getColorClass = (color) => {
    const colors = {
      'orange': 'bg-orange-100 text-orange-700',
      'amber': 'bg-amber-100 text-amber-700',
      'cyan': 'bg-cyan-100 text-cyan-700',
      'emerald': 'bg-emerald-100 text-emerald-700',
      'blue': 'bg-blue-100 text-blue-700',
      'violet': 'bg-violet-100 text-violet-700',
      'red': 'bg-red-100 text-red-700',
      'pink': 'bg-pink-100 text-pink-700',
      'slate': 'bg-slate-100 text-slate-700',
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
      'red': 'bg-red-500',
      'pink': 'bg-pink-500',
      'slate': 'bg-slate-500',
    };
    return colors[color] || 'bg-slate-500';
  };

  const getKategoriColor = (nama) => {
    const cat = MOCK_FACILITY_CATEGORIES.find(c => c.nama === nama);
    return cat?.color || 'slate';
  };

  const computeFallbackKategori = () => {
    const counts = {};
    reports.forEach(r => {
      const key = r.nama_kategori || r.kategori || 'Lainnya';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([nama, count]) => ({
      nama,
      count,
      percentage: reports.length > 0 ? ((count / reports.length) * 100).toFixed(1) : 0,
      color: getKategoriColor(nama),
    })).sort((a, b) => b.count - a.count);
  };

  const computeFallbackKecamatan = () => {
    const counts = {};
    reports.forEach(r => {
      const key = r.nama_kecamatan || r.kecamatan || 'Tidak Diketahui';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([nama, count], i) => ({
      nama,
      count,
    })).sort((a, b) => b.count - a.count);
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    setChartLoading(true);
    try {
      let res;
      try {
        res = await adminAPI.getStatistik();
      } catch {
        res = await adminAPI.getDashboard();
      }

      const data = res.data?.data || res.data;

      if (data) {
        // Chart data
        const weeklySource = data.statistik_harian || data.statistik_mingguan || data.chart_data || data.grafik || [];
        const monthlySource = data.statistik_bulanan || data.statistik_mingguan || data.chart_data || data.grafik || [];

        const mingguan = transformToChartFormat(weeklySource);
        const bulanan = transformToChartFormat(monthlySource);

        if (mingguan.length > 0 || bulanan.length > 0) {
          setChartData({ 
            mingguan: mingguan.length > 0 ? mingguan : MOCK_WEEKLY_CHART,
            bulanan: bulanan.length > 0 ? bulanan : MOCK_MONTHLY_CHART 
          });
        } else {
          setChartData({ mingguan: MOCK_WEEKLY_CHART, bulanan: MOCK_MONTHLY_CHART });
        }

        // Period summary
        const s = data.ringkasan_periode || data.period_summary || data.summary || data.ringkasan;
        if (s) setPeriodSummary(s);

        // Stats overview
        const w = data.statistik_wilayah || data.statistik || data.statistics;
        if (w) {
          setStats({
            total: Number(w.total_laporan ?? w.total ?? w.jumlah ?? 0),
            menunggu: Number(w.menunggu_verifikasi ?? w.menunggu ?? 0),
            diproses: Number(w.diproses ?? w.diterima ?? 0),
            selesai: Number(w.selesai ?? 0),
          });
        }

        // Kategori list
        const catArr = data.statistik_kategori || data.per_kategori || data.kategori || data.laporan_per_kategori;
        if (Array.isArray(catArr) && catArr.length > 0) {
          const mapped = catArr.map(c => ({
            nama: c.nama || c.kategori || c.name,
            count: Number(c.jumlah ?? c.value ?? c.total ?? c.count ?? 0),
            percentage: 0,
            color: getKategoriColor(c.nama || c.kategori || c.name),
          })).sort((a,b)=>b.count - a.count);
          const total = mapped.reduce((s,c)=>s+c.count,0);
          mapped.forEach(c => c.percentage = total > 0 ? ((c.count/total)*100).toFixed(1) : 0);
          setKategoriStats(mapped);
        } else {
          setKategoriStats(computeFallbackKategori());
        }

        // Kecamatan list
        const kecArr = data.statistik_kecamatan || data.per_kecamatan || data.kecamatan || data.laporan_per_kecamatan;
        if (Array.isArray(kecArr) && kecArr.length > 0) {
          const mapped = kecArr.map((k, i) => ({
            nama: k.nama_kecamatan || k.kecamatan || k.nama || k.name,
            count: Number(k.jumlah ?? k.value ?? k.total ?? k.count ?? 0),
          })).sort((a,b)=>b.count - a.count).map((k,i)=>({...k, rank: i+1}));
          setKecamatanStats(mapped);
        } else {
          const fallback = computeFallbackKecamatan().map((k,i)=>({...k, rank: i+1}));
          setKecamatanStats(fallback);
        }
      } else {
        // No data at all, use fallbacks
        setChartData({ mingguan: MOCK_WEEKLY_CHART, bulanan: MOCK_MONTHLY_CHART });
        setKategoriStats(computeFallbackKategori());
        setKecamatanStats(computeFallbackKecamatan());
      }
    } catch (err) {
      setChartData({ mingguan: MOCK_WEEKLY_CHART, bulanan: MOCK_MONTHLY_CHART });
      setKategoriStats(computeFallbackKategori());
      setKecamatanStats(computeFallbackKecamatan());
    } finally {
      setStatsLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const currentChartData = chartData 
    ? (timeRange === 'mingguan' ? chartData.mingguan : chartData.bulanan)
    : (timeRange === 'mingguan' ? MOCK_WEEKLY_CHART : MOCK_MONTHLY_CHART);

  const statsData = stats || {
    total: reports.length,
    menunggu: reports.filter(r => r.status_terkini === 'Menunggu Verifikasi').length,
    diproses: reports.filter(r => r.status_terkini === 'Diterima').length,
    selesai: reports.filter(r => r.status_terkini === 'Selesai').length,
  };

  const displayedCat = showAllCat ? kategoriStats : kategoriStats.slice(0, 6);
  const displayedKec = showAllKec ? kecamatanStats : kecamatanStats.slice(0, 6);

  if (loading && reports.length === 0) return <LoadingScreen message="Memuat analytics..." />;
  if (error && reports.length === 0) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <AdminSidebar activePath="/admin/analytics" onLogout={handleLogout} />
      <LogoutConfirm 
        isOpen={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onConfirm={confirmLogout} 
      />

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
            <NotificationPopup />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {user?.nama?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.nama || 'Admin Kabupaten'}</p>
                <p className="text-[11px] text-slate-500">Dinas PUPR Lamongan</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 space-y-8 max-w-[1400px] w-full mx-auto">
          {/* Period Summary - MOVED TO TOP */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6" />
              <div>
                <h2 className="font-bold text-base">Ringkasan Periode Ini</h2>
                <p className="text-xs text-blue-100 mt-0.5">
                  {periodSummary?.periode || '1 - 30 September 2026'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-xs font-medium text-blue-100 mb-1">Rata-rata Waktu Respon</p>
                <p className="text-2xl font-extrabold">{periodSummary?.avg_response_time || '2.3 hari'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-xs font-medium text-blue-100 mb-1">Tingkat Penyelesaian</p>
                <p className="text-2xl font-extrabold">{periodSummary?.completion_rate || '96%'}</p>
              </div>
            </div>
          </div>

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
              <p className="text-3xl font-bold text-slate-900 mt-2">{statsData.total}</p>
              <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ +12% dari bulan lalu</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menunggu</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{statsData.menunggu}</p>
              <span className="text-xs text-amber-600 font-medium mt-1 inline-block">! Perlu Verifikasi</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diproses</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{statsData.diproses}</p>
              <span className="text-xs text-blue-600 font-medium mt-1 inline-block">Tim Aktif</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selesai</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{statsData.selesai}</p>
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
              {chartLoading ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : (
                <WeeklyChart data={currentChartData} width={600} height={200} />
              )}
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
                {kategoriStats.length > 6 && (
                  <button
                    onClick={() => setShowAllCat(!showAllCat)}
                    className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {showAllCat ? (
                      <>Tampilkan lebih sedikit <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Tampilkan lebih banyak <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {displayedCat.map((cat, i) => (
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
                {kecamatanStats.length > 6 && (
                  <button
                    onClick={() => setShowAllKec(!showAllKec)}
                    className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {showAllKec ? (
                      <>Tampilkan lebih sedikit <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Tampilkan lebih banyak <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {displayedKec.map((kec) => (
                  <div key={kec.nama} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {kec.rank}
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
        </main>
      </div>
    </div>
  );
}

export default AnalyticsPage;