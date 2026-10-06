import React, { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut,
  Search, Bell, ChevronDown, CheckCircle2, Clock, AlertCircle, FileText, Download, Eye, X
} from 'lucide-react';
import { INITIAL_REPORTS } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

function TriageReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = reports.filter(r => {
    const matchSearch = searchTerm === '' || 
      r.ticket_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pelapor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === '' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Menunggu Verifikasi': return 'bg-amber-50 text-amber-700';
      case 'Diterima': return 'bg-blue-50 text-blue-700';
      case 'Selesai': return 'bg-emerald-50 text-emerald-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  const getStatusDotColor = (status) => {
    switch(status) {
      case 'Menunggu Verifikasi': return 'bg-amber-500';
      case 'Diterima': return 'bg-blue-500';
      case 'Selesai': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm">
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

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ticket ID, judul, atau pelapor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Content */}
        <main className="p-8 space-y-8 max-w-[1400px] w-full mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Triage Reports</h1>
            <p className="text-sm text-slate-500">Verifikasi dan proses laporan masuk dari warga</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Diterima">Diterima</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-6">ID Laporan</th>
                    <th className="py-3.5 px-6">Pelapor</th>
                    <th className="py-3.5 px-6">Judul</th>
                    <th className="py-3.5 px-6">Kategori</th>
                    <th className="py-3.5 px-6">Tanggal</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-blue-600">{report.ticket_code}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-800">{report.pelapor}</p>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <p className="font-medium text-slate-800 truncate">{report.judul}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-xs text-slate-600">{report.kategori}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">{new Date(report.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(report.status)}`} />
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

            {filteredReports.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-slate-500 text-sm">Tidak ada laporan yang sesuai dengan filter</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Detail Laporan - {selectedReport.ticket_code}</h3>
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
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
                <p className="text-xs text-slate-400 uppercase font-bold">Kecamatan & Lokasi</p>
                <p className="text-sm text-slate-700">{selectedReport.kecamatan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Deskripsi</p>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedReport.deskripsi}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Pelapor</p>
                <p className="text-sm text-slate-700">{selectedReport.pelapor}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Tanggal Laporan</p>
                <p className="text-sm text-slate-700">{new Date(selectedReport.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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

export default TriageReportsPage;
