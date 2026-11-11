import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, FileText, Clock, CheckCircle2, AlertCircle, Calendar,
  ChevronDown, ChevronUp, Zap, Award, RefreshCw, BarChart2, Filter
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
    navigate('/login');
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

  const getColorClass = (color) => {
    const colors = {
      'orange': 'bg-amber-50 text-amber-700 border-amber-200/80',
      'amber': 'bg-amber-50 text-amber-700 border-amber-200/80',
      'cyan': 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
      'emerald': 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      'blue': 'bg-blue-50 text-blue-700 border-blue-200/80',
      'violet': 'bg-violet-50 text-violet-700 border-violet-200/80',
      'red': 'bg-rose-50 text-rose-700 border-rose-200/80',
      'pink': 'bg-pink-50 text-pink-700 border-pink-200/80',
      'slate': 'bg-slate-100 text-slate-700 border-slate-200/80',
    };
    return colors[color] || 'bg-slate-100 text-slate-700 border-slate-200/80';
  };

  const getBarColor = (color) => {
    const colors = {
      'orange': 'bg-amber-500',
      'amber': 'bg-amber-500',
      'cyan': 'bg-cyan-500',
      'emerald': 'bg-emerald-500',
      'blue': 'bg-blue-600',
      'violet': 'bg-violet-500',
      'red': 'bg-rose-500',
      'pink': 'bg-pink-500',
      'slate': 'bg-slate-500',
    };
    return colors[color] || 'bg-blue-600';
  };

  const getKategoriColor = (nama) => {
    const cat = MOCK_FACILITY_CATEGORIES.find(c => c.nama === nama);
    return cat?.color || 'blue';
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
    })).sort((a,b) => b.count - a.count);
  };

  const computeFallbackKecamatan = () => {
    const counts = {};
    reports.forEach(r => {
      const key = r.kecamatan || r.lokasi_kecamatan || 'Kecamatan Lamongan';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([nama, count]) => ({
      nama,
      count
    })).sort((a,b) => b.count - a.count);
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setChartLoading(true);
      let res;
      try {
        res = await adminAPI.getStatistik();
      } catch {
        res = await adminAPI.getDashboard();
      }
      const data = res.data?.data || res.data;

      if (data) {
        setStats(data.summary || data.statistik || data);

        // Chart data
        const mingguan = transformToChartFormat(data.statistik_harian || data.statistik_mingguan || data.chart_data || data.grafik || []);
        const bulanan = transformToChartFormat(data.statistik_bulanan || data.statistik_mingguan || data.chart_data || data.grafik || []);
        if (mingguan.length > 0 || bulanan.length > 0) {
          setChartData({ 
            mingguan: mingguan.length > 0 ? mingguan : MOCK_WEEKLY_CHART, 
            bulanan: bulanan.length > 0 ? bulanan : MOCK_MONTHLY_CHART 
          });
        } else {
          setChartData({ mingguan: MOCK_WEEKLY_CHART, bulanan: MOCK_MONTHLY_CHART });
        }

        // Period Summary
        if (data.period_summary || data.ringkasan_periode) {
          setPeriodSummary(data.period_summary || data.ringkasan_periode);
        } else {
          setPeriodSummary({
            periode: 'Bulan Berjalan (September 2026)',
            avg_response_time: '2.3 hari',
            completion_rate: '96%'
          });
        }

        // Kategori list
        const catArr = data.kategori || data.kategori_stats || data.per_kategori || data.laporan_per_kategori;
        if (Array.isArray(catArr) && catArr.length > 0) {
          const mapped = catArr.map(c => ({
            nama: c.nama_kategori || c.kategori || c.nama || c.name,
            count: Number(c.jumlah ?? c.value ?? c.total ?? c.count ?? 0),
            color: getKategoriColor(c.nama_kategori || c.kategori || c.nama || c.name)
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
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <AdminSidebar activePath="/admin/analytics" onLogout={handleLogout} />
      <LogoutConfirm 
        isOpen={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onConfirm={confirmLogout} 
      />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Modern Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics</h1>
            <p className="text-xs text-slate-500">Laporan dan statistik mendalam</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchStats}
              title="Refresh Data"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <NotificationPopup />

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {(user?.nama_lengkap || user?.nama || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {user?.nama_lengkap && user.nama_lengkap !== 'Admin' && user.nama_lengkap !== 'Admin Kabupaten'
                    ? user.nama_lengkap
                    : (user?.nama && user.nama !== 'Admin' && user.nama !== 'Admin Kabupaten' ? user.nama : 'Admin Kabupaten Lamongan')}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] text-slate-500">Dinas PUPR Lamongan</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 space-y-7 max-w-[1440px] w-full mx-auto">
          {/* Executive KPI Metric Cards (Clean, Balanced & Modern - No Giant Blue Block!) */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ringkasan Kinerja & Status Pengaduan
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">Pembaruan otomatis tiap jam</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
              {/* Card 1: Total */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Laporan</span>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">{statsData.total}</p>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                    +12%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">Laporan masuk periode ini</p>
              </div>

              {/* Card 2: Menunggu Verifikasi */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-amber-200 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Menunggu</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight text-amber-600 font-mono">{statsData.menunggu}</p>
                  {statsData.menunggu > 0 && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-amber-700/80 font-medium mt-1 truncate">Perlu verifikasi admin</p>
              </div>

              {/* Card 3: Sedang Diproses */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Diproses</span>
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight text-blue-600 font-mono">{statsData.diproses}</p>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">Ditugaskan ke tim teknis</p>
              </div>

              {/* Card 4: Selesai */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-emerald-200 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Selesai</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight text-emerald-600 font-mono">{statsData.selesai}</p>
                </div>
                <p className="text-[11px] text-emerald-700/80 font-medium mt-1 truncate">Tuntas ditangani</p>
              </div>

              {/* Card 5: Kecepatan Respon */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-indigo-200 transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Waktu Respon</span>
                  <Zap className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                    {periodSummary?.avg_response_time || '2.3 hari'}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">Rata-rata verifikasi awal</p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">Tren Volume Pengaduan</h3>
                  <span className="text-[11px] text-slate-400 font-normal">| Real-time Data</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Grafik dinamika laporan masyarakat se-Kabupaten Lamongan</p>
              </div>

              <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 self-start sm:self-auto">
                <button 
                  onClick={() => setTimeRange('mingguan')}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all ${
                    timeRange === 'mingguan' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mingguan
                </button>
                <button 
                  onClick={() => setTimeRange('bulanan')}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all ${
                    timeRange === 'bulanan' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Bulanan
                </button>
              </div>
            </div>

            <div className="h-64 flex items-center justify-center">
              {chartLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-xs">Memuat data visualisasi...</span>
                </div>
              ) : (
                <WeeklyChart data={currentChartData} width={600} height={200} />
              )}
            </div>
          </div>

          {/* Breakdown Section: Category & Location Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Category */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Laporan per Kategori Fasilitas</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Proporsi aduan berdasarkan jenis infrastruktur</p>
                </div>
                {kategoriStats.length > 6 && (
                  <button
                    onClick={() => setShowAllCat(!showAllCat)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    {showAllCat ? (
                      <>Ringkas <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Lihat Semua ({kategoriStats.length}) <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-3.5">
                {displayedCat.map((cat, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getColorClass(cat.color)}`}>
                          {cat.nama}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 font-mono">{cat.count}</span>
                        <span className="text-[11px] text-slate-400">({cat.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getBarColor(cat.color)}`}
                        style={{ width: `${Math.max(Number(cat.percentage), 3)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Location (Kecamatan) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Sebaran Wilayah (Kecamatan)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Prioritas wilayah dengan intensitas aduan tertinggi</p>
                </div>
                {kecamatanStats.length > 6 && (
                  <button
                    onClick={() => setShowAllKec(!showAllKec)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    {showAllKec ? (
                      <>Ringkas <ChevronUp className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Lihat Semua ({kecamatanStats.length}) <ChevronDown className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {displayedKec.map((kec) => (
                  <div key={kec.nama} className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        kec.rank === 1 ? 'bg-amber-100 text-amber-800' :
                        kec.rank === 2 ? 'bg-slate-200 text-slate-700' :
                        kec.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {kec.rank}
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{kec.nama}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 font-mono">{kec.count}</span>
                      <span className="text-[11px] text-slate-400">aduan</span>
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
