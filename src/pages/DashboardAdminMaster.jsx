import React, { useState, useEffect } from 'react';
import {
  Search, ChevronDown, CheckCircle2, Clock, AlertCircle, FileText, Download, Eye, Loader2, ChevronRight
} from 'lucide-react';
import { MOCK_FACILITY_CATEGORIES, MOCK_WEEKLY_CHART, MOCK_MONTHLY_CHART } from '../utils/mockData';
import WeeklyChart from '../components/mobile/WeeklyChart';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/useAuthStore';
import { useLaporanList } from '../hooks/useLaporanList';
import { adminAPI } from '../services/api';
import ErrorState from '../components/ui/ErrorState';
import NotificationPopup from '../components/ui/NotificationPopup';
import AdminSidebar from '../components/AdminSidebar';
import AdminUserBadge from '../components/admin/AdminUserBadge';

function DashboardAdminMaster() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reports, loading, error, reload, page, totalPages, setPage } = useLaporanList();
  const [searchCategory, setSearchCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [lamonganBoundary, setLamonganBoundary] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('mingguan');
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Fetch chart data from backend
  const fetchChartData = async () => {
    try {
      setChartLoading(true);

      let res;
      try {
        res = await adminAPI.getStatistik();
      } catch {
        res = await adminAPI.getDashboard();
      }

      const data = res.data?.data || res.data;

      const transformToChartFormat = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(item => ({
          label: item.label || item.tanggal || item.periode || item.hari || item.bulan || item.nama || '',
          value: Number(item.value || item.jumlah || item.total || item.count || 0)
        })).filter(item => item.label && !isNaN(item.value));
      };

      if (data) {
        const mingguan = transformToChartFormat(data.statistik_harian || data.statistik_mingguan || data.chart_data || data.grafik || []);
        const bulanan = transformToChartFormat(data.statistik_bulanan || data.statistik_mingguan || data.chart_data || data.grafik || []);

        if (mingguan.length > 0 || bulanan.length > 0) {
          setChartData({ mingguan, bulanan });
        } else {
          setChartData({ mingguan: MOCK_WEEKLY_CHART, bulanan: MOCK_MONTHLY_CHART });
        }
      } else {
        setChartData({ mingguan: MOCK_WEEKLY_CHART, bulanan: MOCK_MONTHLY_CHART });
      }
    } catch (err) {
      setChartData({ mingguan: MOCK_WEEKLY_CHART, bulanan: MOCK_MONTHLY_CHART });
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

  // Show only first 10 reports (page 1)
  const displayedReports = filteredReports.slice(0, 10);

  const handleLogout = () => {
    setLogoutOpen(true);
  };

  const handleExportData = () => {
    if (!filteredReports || filteredReports.length === 0) {
      toast.error('Tidak ada data laporan untuk diekspor');
      return;
    }

    const escapeCsv = (value) => {
      const str = value === null || value === undefined ? '' : String(value);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'ID Laporan',
      'Pelapor',
      'Judul Laporan',
      'Kategori',
      'Kecamatan',
      'Tanggal',
      'Status',
      'Deskripsi',
    ];

    const rows = filteredReports.map((r) => {
      const rawDate = r.tanggal || r.created_at;
      const formattedDate = rawDate
        ? new Date(rawDate).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '-';
      return [
        r.id_laporan || r.ticket_code || r.id || '',
        r.nama_lengkap || r.pelapor || '-',
        r.judul_laporan || r.judul || '-',
        r.kategori || r.nama_kategori || '-',
        r.nama_kecamatan || r.kecamatan || '-',
        formattedDate,
        r.status_terkini || r.status || '-',
        r.deskripsi_laporan || r.deskripsi || '',
      ]
        .map(escapeCsv)
        .join(',');
    });

    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `laporan-fasum-${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${filteredReports.length} laporan berhasil diekspor`);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setLogoutOpen(false);
  };

  const cancelLogout = () => {
    setLogoutOpen(false);
  };

  // Inline loading indicator for main content only
  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-900">
        <AdminSidebar activePath="/admin/master" />
        <div className="flex-1 ml-64 flex flex-col min-w-0">
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-xs text-slate-500">Ringkasan sistem dan laporan infrastruktur</p>
            </div>
          </header>
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-sm">Memuat dashboard...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error && reports.length === 0) return <ErrorState message={error} onRetry={reload} />;

  // Stats calculation
  const stats = {
    total: reports.length,
    menunggu: reports.filter(r => r.status_terkini === 'Menunggu Verifikasi').length,
    diproses: reports.filter(r => r.status_terkini === 'Diterima').length,
    selesai: reports.filter(r => r.status_terkini === 'Selesai').length,
  };

  const getCurrentChartData = () => {
    if (!chartData) return MOCK_WEEKLY_CHART;
    return timeRange === 'mingguan' ? chartData.mingguan : chartData.bulanan;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-900">
      <AdminSidebar activePath="/admin/master" />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Modern Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-xs text-slate-500">Ringkasan sistem dan laporan infrastruktur</p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationPopup />
            <AdminUserBadge />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 space-y-7 max-w-[1440px] w-full mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Laporan</p>
                <p className="text-2xl font-bold tracking-tight text-slate-900 font-mono mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-amber-200 transition-all flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Menunggu Tinjauan</p>
                <p className="text-2xl font-bold tracking-tight text-amber-600 font-mono mt-1">{stats.menunggu}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-all flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sedang Diproses</p>
                <p className="text-2xl font-bold tracking-tight text-blue-600 font-mono mt-1">{stats.diproses}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-emerald-200 transition-all flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Selesai</p>
                <p className="text-2xl font-bold tracking-tight text-emerald-600 font-mono mt-1">{stats.selesai}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
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
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${timeRange === 'mingguan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    Mingguan
                  </button>
                  <button
                    onClick={() => setTimeRange('bulanan')}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${timeRange === 'bulanan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    Bulanan
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center w-full">
                {chartLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                ) : (
                  <WeeklyChart data={getCurrentChartData()} width="100%" height={220} />
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
                        color: '#2563eb',
                        weight: 2.5,
                        opacity: 1,
                        fillColor: '#2563eb',
                        fillOpacity: 0.05,
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

                <button
                  type="button"
                  onClick={handleExportData}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
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
                  {displayedReports.map((r) => (
                    <tr key={r.id_laporan || r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-blue-600">{r.id_laporan || r.ticket_code}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-800">{r.nama_lengkap || r.pelapor}</p>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <p className="font-medium text-slate-800 truncate">{r.judul_laporan || r.judul}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{r.kategori || r.nama_kategori}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">{new Date(r.tanggal || r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status_terkini || r.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(r.status_terkini || r.status)}`} />
                          {r.status_terkini || r.status || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedReport(r)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {displayedReports.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-slate-400">Tidak ada laporan</p>
              </div>
            )}

            {/* Lihat Semua Button */}
            {filteredReports.length > displayedReports.length && (
              <div className="text-center pt-4">
                <button
                  onClick={() => navigate('/admin/triage')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
                >
                  Lihat Semua Laporan ({filteredReports.length})
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Detail Modal */}
          {selectedReport && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1500] p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-lg">Detail Laporan - {selectedReport.id_laporan}</h3>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo */}
                  <div className="relative">
                    <img
                      src={selectedReport.foto_bukti}
                      alt={selectedReport.judul_laporan}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Judul & Kategori</p>
                      <p className="font-semibold text-slate-800 text-base mt-1">{selectedReport.judul_laporan}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">{selectedReport.kategori}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Pelapor</p>
                      <p className="text-sm text-slate-700 mt-1">{selectedReport.nama_lengkap}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Kecamatan</p>
                      <p className="text-sm text-slate-700 mt-1">{selectedReport.nama_kecamatan || selectedReport.kecamatan}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Tanggal</p>
                      <p className="text-sm text-slate-700 mt-1">
                        {new Date(selectedReport.tanggal || selectedReport.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${getStatusColor(selectedReport.status_terkini || selectedReport.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(selectedReport.status_terkini || selectedReport.status)}`} />
                        {selectedReport.status_terkini || selectedReport.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Deskripsi</p>
                      <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedReport.deskripsi_laporan || selectedReport.deskripsi}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View All Link */}
          {displayedReports.length > 0 && filteredReports.length > displayedReports.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto"
              >
                {showAll ? 'Sembunyikan' : 'Lihat Semua'} ({filteredReports.length} total)
                <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Menunggu Verifikasi': return 'bg-amber-50 text-amber-700';
    case 'Diterima': return 'bg-blue-50 text-blue-700';
    case 'Selesai': return 'bg-emerald-50 text-emerald-700';
    case 'Ditolak': return 'bg-red-50 text-red-700';
    default: return 'bg-slate-50 text-slate-700';
  }
}

function getStatusDotColor(status) {
  switch (status) {
    case 'Menunggu Verifikasi': return 'bg-amber-500';
    case 'Diterima': return 'bg-blue-500';
    case 'Selesai': return 'bg-emerald-500';
    case 'Ditolak': return 'bg-red-500';
    default: return 'bg-slate-500';
  }
}

export default DashboardAdminMaster;