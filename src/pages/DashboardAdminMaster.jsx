import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut, 
  Search, Bell, ChevronDown, CheckCircle2, Clock, AlertCircle, FileText, Download, Eye 
} from 'lucide-react';
import { MOCK_FACILITY_CATEGORIES, MOCK_WEEKLY_CHART } from '../utils/mockData';
import WeeklyChart from '../components/mobile/WeeklyChart';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useLaporanList } from '../hooks/useLaporanList';
import { laporanAPI, masterAPI, adminAPI } from '../services/api';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorState from '../components/ui/ErrorState';

function DashboardAdminMaster() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { reports, loading, error, reload } = useLaporanList();
  const [searchCategory, setSearchCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [lamonganBoundary, setLamonganBoundary] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('mingguan');

  // Fetch chart data from backend
  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      
      // Try admin dashboard first, fall back to analytics
      let res;
      try {
        res = await adminAPI.getDashboard();
      } catch {
        res = await masterAPI.getAnalytics();
      }

      const data = res.data?.data || res.data;
      
      // Transform API data to WeeklyChart format: [{label, value}, ...]
      const transformToChartFormat = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => ({
          label: item.label || item.tanggal || item.periode || item.hari || item.bulan || item.nama || '',
          value: Number(item.value || item.jumlah || item.total || item.count || 0)
        })).filter(item => item.label && !isNaN(item.value));
      };

      if (data) {
        console.log('Dashboard API response:', data);
        const mingguan = transformToChartFormat(data.statistik_harian || data.statistik_mingguan || data.chart_data || data.grafik || []);
        const bulanan = transformToChartFormat(data.statistik_bulanan || data.statistik_mingguan || data.chart_data || data.grafik || []);

        console.log('Transformed mingguan:', mingguan);
        console.log('Transformed bulanan:', bulanan);

        if (mingguan.length > 0 || bulanan.length > 0) {
          setChartData({ mingguan, bulanan });
        }
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
    } finally {
      setChartLoading(false);
    }
  };

  // Fetch Lamongan boundary
  const fetchLamonganBoundary = async () => {
    try {
      const response = await fetch('/lamongan.geojson');
      if (!response.ok) throw new Error('Gagal memuat batas wilayah');
      const data = await response.json();
      setLamonganBoundary(data);
    } catch (err) {
      console.error('Error loading Lamongan boundary:', err);
    }
  };

  useEffect(() => {
    fetchChartData();
    fetchLamonganBoundary();
  }, []);

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchCategory = searchCategory === '' || r.kategori === searchCategory;
    const matchStatus = filterStatus === '' || r.status === filterStatus;
    return matchCategory && matchStatus;
  });

  const displayedReports = showAll ? filteredReports : filteredReports.slice(0, 10);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  if (loading && reports.length === 0) return <LoadingScreen message="Memuat dashboard..." />;

  if (error && reports.length === 0) return <ErrorState message={error} onRetry={reload} />;

  // Stats calculation
  const stats = {
    total: reports.length,
    menunggu: reports.filter(r => r.status === 'Menunggu Verifikasi').length,
    diproses: reports.filter(r => r.status === 'Diterima').length,
    selesai: reports.filter(r => r.status === 'Selesai').length,
  };

  const getCurrentChartData = () => {
    if (!chartData) return MOCK_WEEKLY_CHART;
    return timeRange === 'mingguan' ? chartData.mingguan : chartData.bulanan;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar (Left) */}
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm">
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
          <button onClick={() => navigate('/admin/analytics')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
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
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-red-400 font-medium text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket ID, location, or keyword..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {user?.nama?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.nama_lengkap || 'Admin'}</p>
                <p className="text-[11px] text-slate-500">Dinas PUPR Lamongan</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 space-y-8 max-w-[1400px] w-full mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Laporan</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ +12% dari bulan lalu</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menunggu Tinjauan</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.menunggu}</p>
                <span className="text-xs text-amber-600 font-medium mt-1 inline-block">! Perlu Aksi Cepat</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sedang Diproses</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.diproses}</p>
                <span className="text-xs text-blue-600 font-medium mt-1 inline-block">Tim Lapangan Aktif</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selesai Diperbaiki</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.selesai}</p>
                <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">96% Tepat Waktu</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Chart & Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Tren Volume Laporan Kerusakan</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Statistik pengaduan infrastruktur di Kabupaten Lamongan</p>
                </div>
                <div className="flex bg-slate-100 rounded-full p-1">
                  <button 
                    onClick={() => setTimeRange('mingguan')}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
                      timeRange === 'mingguan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Mingguan
                  </button>
                  <button 
                    onClick={() => setTimeRange('bulanan')}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${
                      timeRange === 'bulanan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
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
                  <WeeklyChart data={getCurrentChartData()} width={600} height={200} />
                )}
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Sebaran Lokasi</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Hotspot kerusakan infrastruktur</p>
                </div>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-full">Live GIS</span>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden min-h-[220px] relative border border-slate-200">
                <MapContainer 
                  center={[-7.169249504786527, 112.33849173392773]} 
                  zoom={11} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  attributionControl={false}
                  whenCreated={(map) => { window.mapRef = map; }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {lamonganBoundary && (
                    <GeoJSON
                      data={lamonganBoundary}
                      style={{
                        color: '#ef4444',
                        weight: 2,
                        opacity: 1,
                        fillColor: '#ef4444',
                        fillOpacity: 0.15,
                        lineCap: 'round',
                        lineJoin: 'round',
                      }}
                      onEachFeature={(feature, layer) => {
                        if (window.mapRef) {
                          const bounds = layer.getBounds();
                          window.mapRef.fitBounds(bounds, { padding: [20, 20], maxZoom: 12 });
                        }
                      }}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Laporan Masuk Terbaru</h2>
                <p className="text-xs text-slate-500 mt-0.5">Daftar aduan fasilitas umum yang memerlukan verifikasi cepat</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Kategori</option>
                  {MOCK_FACILITY_CATEGORIES.map(c => (
                    <option key={c.id} value={c.nama}>{c.nama}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Semua Status</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Selesai">Selesai</option>
                </select>

                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export Data
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-6">ID Laporan</th>
                    <th className="py-3.5 px-6">Pelapor</th>
                    <th className="py-3.5 px-6">Kategori & Lokasi</th>
                    <th className="py-3.5 px-6">Tanggal</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {displayedReports.map((report) => (
                    <tr key={report.id_laporan || report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-blue-600">{report.id_laporan}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-800">{report.nama_lengkap}</p>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <p className="font-medium text-slate-800 truncate">{report.nama_kategori}</p>
                        <p className="text-xs text-slate-400 truncate">{report.judul_laporan} - {report.id_kecamatan_kejadian}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          report.status_terkini === 'Menunggu Verifikasi' ? 'bg-amber-50 text-amber-700' :
                          report.status_terkini === 'Diterima' ? 'bg-blue-50 text-blue-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            report.status_terkini === 'Menunggu Verifikasi' ? 'bg-amber-500' :
                            report.status_terkini === 'Diterima' ? 'bg-blue-500' :
                            'bg-emerald-500'
                          }`} />
                          {report.status_terkini}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReports.length > 10 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${filteredReports.length} Laporan)`}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1500] p-4 sm:p-6"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-start justify-between gap-6 px-6 py-5 border-b border-slate-200 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Detail Laporan</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-semibold font-mono text-blue-600">
                    {selectedReport.id_laporan || selectedReport.ticket_code || '-'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug mt-1 break-words">
                  {selectedReport.judul_laporan || 'Tanpa Judul'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                title="Tutup"
              >
                ✕
              </button>
            </header>

            {/* Body: foto di kiri, detail di kanan */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)]">
                <div className="bg-slate-100 p-4 md:p-5 border-b md:border-b-0 md:border-r border-slate-200">
                  {selectedReport.foto_bukti ? (
                    <img
                      src={selectedReport.foto_bukti}
                      alt="Foto bukti laporan"
                      className="w-full h-auto rounded-xl border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-64 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <AlertCircle className="w-7 h-7" />
                      <span className="text-xs font-medium">Foto tidak tersedia</span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-2 flex-wrap border-b border-slate-100 pb-5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_BADGE[selectedReport.status_terkini || selectedReport.status] || 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {selectedReport.status_terkini || selectedReport.status || '-'}
                    </span>
                    {(selectedReport.nama_kategori || selectedReport.id_kategori) && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {selectedReport.nama_kategori || selectedReport.id_kategori}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <InfoItem label="Pelapor" value={selectedReport.nama_lengkap} />
                    <InfoItem label="Kecamatan" value={selectedReport.nama_kecamatan} />
                    <InfoItem
                      label="Tanggal Laporan"
                      value={
                        selectedReport.created_at
                          ? new Date(selectedReport.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                          : ''
                      }
                    />
                    <InfoItem
                      label="Waktu Diperbarui"
                      value={selectedReport.updated_at ? new Date(selectedReport.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Deskripsi</p>
                    <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4">
                      {selectedReport.deskripsi_laporan || 'Tidak ada deskripsi untuk laporan ini.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Tutup
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAdminMaster;

const STATUS_BADGE = {
  'Menunggu Verifikasi': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Diterima': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Selesai': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Ditolak': 'bg-red-50 text-red-700 border border-red-200',
};

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800 leading-snug break-words">
        {value || <span className="text-slate-400 font-normal italic">-</span>}
      </p>
    </div>
  );
}
