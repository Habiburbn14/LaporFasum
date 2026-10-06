import React, { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut, 
  Search, Bell, ChevronDown, CheckCircle2, Clock, AlertCircle, FileText, Download, Eye 
} from 'lucide-react';
import { INITIAL_REPORTS, MOCK_FACILITY_CATEGORIES, MOCK_WEEKLY_CHART } from '../utils/mockData';
import WeeklyChart from '../components/mobile/WeeklyChart';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Generate 10 mock reports for admin table demo
const ADMIN_INITIAL_REPORTS = [
  ...INITIAL_REPORTS,
  {
    id: 7,
    ticket_code: "LMG-RAM-007",
    judul: "Rambu Lalu Lintas Roboh di Perempatan Sugio",
    kategori: "Rambu dan Marka Jalan",
    kecamatan: "Sugio",
    deskripsi: "Rambu penunjuk arah tertabrak truk dan roboh menghalangi bahu jalan.",
    latitude: -6.8450,
    longitude: 112.1950,
    status: "Menunggu Verifikasi",
    tanggal: "2026-08-22 09:10:00",
    pelapor: "Joko Susilo",
    foto: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 8,
    ticket_code: "LMG-TRN-008",
    judul: "Atap Halte Bus Paciran Bocor Parah",
    kategori: "Transportasi Publik (Halte, Terminal)",
    kecamatan: "Paciran",
    deskripsi: "Warga yang menunggu bus kepanasan dan kehujanan karena atap bolong.",
    latitude: -6.7890,
    longitude: 112.3210,
    status: "Diterima",
    tanggal: "2026-08-21 13:20:00",
    pelapor: "Kusnadi",
    foto: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 9,
    ticket_code: "LMG-OLH-009",
    judul: "Lampu Stadion Olahraga Padam Sebagian",
    kategori: "Fasilitas Olahraga dan Rekreasi",
    kecamatan: "Lamongan",
    deskripsi: "Lampu sorot tribun utara mati total, mengganggu latihan malam atlet.",
    latitude: -6.8938,
    longitude: 112.2140,
    status: "Selesai",
    tanggal: "2026-08-19 19:00:00",
    pelapor: "Agung Prasetyo",
    foto: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 10,
    ticket_code: "LMG-PSR-010",
    judul: "Saluran Pembuangan Pasar Tradisional Mampet",
    kategori: "Pasar Tradisional",
    kecamatan: "Lamongan",
    deskripsi: "Bau tidak sedap menyengat akibat got pasar meluap ke lorong pedagang.",
    latitude: -6.8950,
    longitude: 112.2170,
    status: "Menunggu Verifikasi",
    tanggal: "2026-08-18 07:30:00",
    pelapor: "Sartika",
    foto: "https://images.unsplash.com/photo-1581092163562-40038e57e0bc?auto=format&fit=crop&q=80&w=600"
  }
];

function DashboardAdminMaster() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(ADMIN_INITIAL_REPORTS);
  const [searchCategory, setSearchCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [timeRange, setTimeRange] = useState('mingguan');

  // Stats calculation
  const stats = {
    total: reports.length,
    menunggu: reports.filter(r => r.status === 'Menunggu Verifikasi').length,
    diproses: reports.filter(r => r.status === 'Diterima').length,
    selesai: reports.filter(r => r.status === 'Selesai').length,
  };

  // Chart data based on time range
  const chartData = timeRange === 'mingguan' ? MOCK_WEEKLY_CHART : MOCK_MONTHLY_CHART;

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchCategory = searchCategory === '' || r.kategori === searchCategory;
    const matchStatus = filterStatus === '' || r.status === filterStatus;
    return matchCategory && matchStatus;
  });

  const displayedReports = showAll ? filteredReports : filteredReports.slice(0, 10);

  const handleStatusChange = (id, newStatus) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
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
            onClick={() => navigate('/admin-login')}
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
                <WeeklyChart data={chartData} width={600} height={200} />
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
                  center={[-6.8938, 112.2140]} 
                  zoom={11} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {reports.map((r, i) => (
                    <Marker key={i} position={[r.latitude, r.longitude]}>
                      <Popup>
                        <div className="text-xs">
                          <p className="font-bold">{r.ticket_code}</p>
                          <p>{r.judul}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
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
                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-blue-600">{report.ticket_code}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-800">{report.pelapor}</p>
                        <p className="text-xs text-slate-400">+62 812-3456-7890</p>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <p className="font-medium text-slate-800 truncate">{report.kategori}</p>
                        <p className="text-xs text-slate-400 truncate">{report.judul} - {report.kecamatan}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">{new Date(report.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'Menunggu Verifikasi' ? 'bg-amber-50 text-amber-700' :
                          report.status === 'Diterima' ? 'bg-blue-50 text-blue-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            report.status === 'Menunggu Verifikasi' ? 'bg-amber-500' :
                            report.status === 'Diterima' ? 'bg-blue-500' :
                            'bg-emerald-500'
                          }`} />
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <select
                            value={report.status}
                            onChange={(e) => handleStatusChange(report.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                            <option value="Diterima">Diterima</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                          <button 
                            onClick={() => setSelectedReport(report)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Detail Laporan - {selectedReport.ticket_code}</h3>
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <img src={selectedReport.foto} alt="Bukti" className="w-full h-48 object-cover rounded-xl" />
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Judul & Kategori</p>
                <p className="font-semibold text-slate-800 text-sm">{selectedReport.judul}</p>
                <p className="text-xs text-blue-600 font-medium">{selectedReport.kategori}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Lokasi & Kecamatan</p>
                <p className="text-sm text-slate-700">{selectedReport.kecamatan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Deskripsi</p>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedReport.deskripsi}</p>
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
    </div>
  );
}

export default DashboardAdminMaster;
