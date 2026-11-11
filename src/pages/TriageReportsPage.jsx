import React, { useState } from 'react';
import {
  Search, ChevronDown, CheckCircle2, Clock, AlertCircle, FileText, Download, Eye, X, MapPin,
  RefreshCw, Filter, Check, ShieldCheck, Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/useAuthStore';
import { useLaporanList } from '../hooks/useLaporanList';
import { laporanAPI } from '../services/api';
import { getErrorMessage } from '../utils/error';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import NotificationPopup from '../components/ui/NotificationPopup';
import AdminSidebar from '../components/AdminSidebar';
import LogoutConfirm from '../components/ui/LogoutConfirm';

function ImageWithFallback({ src, alt, className = '' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-2">
            <span className="text-2xl">🖼️</span>
          </div>
          <p className="text-sm font-medium">Gambar tidak tersedia</p>
          <p className="text-xs text-slate-500 mt-1">Gagal memuat bukti foto</p>
        </div>
      )}
    </div>
  );
}

function TriageReportsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { reports, setReports, loading, error, reload } = useLaporanList();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionReport, setActionReport] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => setLogoutOpen(true);

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setLogoutOpen(false);
  };

  const cancelLogout = () => setLogoutOpen(false);

  const reportId = (r) => r.id_laporan || r.ticket_code || r.id;

  const countByStatus = {
    all: reports.length,
    menunggu: reports.filter(r => r.status_terkini === 'Menunggu Verifikasi').length,
    diterima: reports.filter(r => r.status_terkini === 'Diterima').length,
    selesai: reports.filter(r => r.status_terkini === 'Selesai').length,
    ditolak: reports.filter(r => r.status_terkini === 'Ditolak').length,
  };

  const filteredReports = reports.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchSearch = searchTerm === '' ||
      String(r.id_laporan || r.ticket_code || '').toLowerCase().includes(term) ||
      String(r.judul_laporan || r.judul || '').toLowerCase().includes(term) ||
      String(r.nama_lengkap || r.pelapor || '').toLowerCase().includes(term) ||
      String(r.nama_kategori || r.kategori || '').toLowerCase().includes(term);

    const matchStatus = filterStatus === '' || r.status_terkini === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAction = (report, type) => {
    setActionReport(report);
    setActionType(type);
    setRejectReason('');
  };

  const closeAction = () => {
    setActionReport(null);
    setActionType(null);
    setRejectReason('');
  };

  const confirmAction = async () => {
    if (!actionReport) return;
    const isReject = actionType === 'reject';
    if (isReject && !rejectReason.trim()) {
      toast.error('Alasan penolakan wajib diisi');
      return;
    }

    const id = reportId(actionReport);
    const newStatus = isReject ? 'Ditolak' : 'Diterima';
    const reason = isReject ? rejectReason.trim() : undefined;
    const kewenangan = isReject ? 'Dinas PU' : null;

    setSubmitting(true);
    try {
      await laporanAPI.updateStatus(id, newStatus, reason, kewenangan);
      setReports(prev => prev.map(r =>
        reportId(r) === id
          ? { ...r, status: newStatus, status_terkini: newStatus, ...(isReject ? { tanggapan: reason } : {}) }
          : r
      ));
      toast.success(isReject ? 'Laporan berhasil ditolak' : 'Laporan berhasil diterima & diverifikasi');
      closeAction();
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Gagal memperbarui status');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu Verifikasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            Menunggu Verifikasi
          </span>
        );
      case 'Diterima':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Diterima
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Selesai
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            {status || '-'}
          </span>
        );
    }
  };

  if (loading && reports.length === 0) return <LoadingScreen message="Memuat triage laporan..." />;
  if (error && reports.length === 0) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-900">
      <AdminSidebar activePath="/admin/triage" onLogout={handleLogout} />
      <LogoutConfirm 
        isOpen={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onConfirm={confirmLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Modern Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Triage Reports</h1>
            <p className="text-xs text-slate-500">Verifikasi dan proses laporan masuk dari warga</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={reload}
              title="Refresh Laporan"
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
        <main className="p-8 space-y-6 max-w-[1440px] w-full mx-auto">
          {/* Controls Bar: Segmented Tabs & Search */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Segmented Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterStatus('')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  filterStatus === ''
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Semua Status</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filterStatus === '' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {countByStatus.all}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('Menunggu Verifikasi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  filterStatus === 'Menunggu Verifikasi'
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Perlu Verifikasi</span>
                {countByStatus.menunggu > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    filterStatus === 'Menunggu Verifikasi' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {countByStatus.menunggu}
                  </span>
                )}
              </button>

              <button
                onClick={() => setFilterStatus('Diterima')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  filterStatus === 'Diterima'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Diterima / Diproses</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filterStatus === 'Diterima' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {countByStatus.diterima}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('Selesai')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  filterStatus === 'Selesai'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Selesai</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filterStatus === 'Selesai' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {countByStatus.selesai}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('Ditolak')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  filterStatus === 'Ditolak'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Ditolak</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filterStatus === 'Ditolak' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {countByStatus.ditolak}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ID, pelapor, atau judul..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Clean Enterprise Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-3 px-5">ID Ticket</th>
                    <th className="py-3 px-5">Pelapor</th>
                    <th className="py-3 px-5">Judul & Detail Aduan</th>
                    <th className="py-3 px-5">Kategori</th>
                    <th className="py-3 px-5">Tanggal</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredReports.map((report) => (
                    <tr key={report.id_laporan || report.id} className="hover:bg-slate-50/75 transition-colors group">
                      {/* Ticket Code */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50/75 px-2 py-1 rounded-md border border-blue-200/60">
                          #{report.id_laporan || report.ticket_code}
                        </span>
                      </td>

                      {/* Pelapor */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0">
                            {report.nama_lengkap ? report.nama_lengkap.charAt(0).toUpperCase() : 'W'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{report.nama_lengkap || 'Warga Lamongan'}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{report.telepon || report.email || 'Terdaftar'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Judul & Lokasi */}
                      <td className="py-3.5 px-5 max-w-sm">
                        <p className="font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {report.judul_laporan || report.judul}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{report.nama_kecamatan || report.kecamatan || 'Kabupaten Lamongan'}</span>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                          {report.nama_kategori || report.kategori || 'Fasilitas'}
                        </span>
                      </td>

                      {/* Tanggal */}
                      <td className="py-3.5 px-5 whitespace-nowrap text-slate-500 font-medium">
                        {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {getStatusBadge(report.status_terkini)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {report.status_terkini === 'Menunggu Verifikasi' ? (
                            <>
                              <button
                                onClick={() => openAction(report, 'accept')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
                                title="Terima dan teruskan ke dinas teknis"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Terima
                              </button>
                              <button
                                onClick={() => openAction(report, 'reject')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-semibold text-xs transition-all active:scale-95"
                                title="Tolak laporan tidak valid"
                              >
                                <X className="w-3.5 h-3.5" />
                                Tolak
                              </button>
                            </>
                          ) : null}

                          <button 
                            onClick={() => setSelectedReport(report)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="Inspeksi Detail Laporan"
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
              <div className="py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">Tidak Ada Laporan</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Tidak ditemukan laporan yang cocok dengan filter atau kata kunci pencarian saat ini.
                </p>
              </div>
            )}

            {/* Table Footer */}
            <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Menampilkan <strong className="text-slate-800">{filteredReports.length}</strong> dari {reports.length} laporan</span>
              <span className="text-[11px] text-slate-400">Pusat Kendali Pengaduan Lamongan</span>
            </div>
          </div>
        </main>
      </div>

      {/* Modern Detail Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1500] p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 text-xs">
                  #{selectedReport.id_laporan || selectedReport.ticket_code}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">Inspeksi Laporan Warga</h3>
                  <p className="text-xs text-slate-500">Detail bukti foto dan metadata kependudukan</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Image Preview (Left) */}
              <div className="md:w-1/2 bg-slate-950 flex items-center justify-center relative min-h-[320px]">
                <ImageWithFallback 
                  src={selectedReport.foto_bukti} 
                  alt="Bukti kerusakan"
                  className="w-full h-full object-contain max-h-[480px]"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Bukti Lapangan
                </div>
              </div>
              
              {/* Metadata Details (Right) */}
              <div className="p-6 md:w-1/2 overflow-y-auto space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Saat Ini</span>
                  <div className="mt-1">
                    {getStatusBadge(selectedReport.status_terkini)}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Judul Pengaduan</span>
                  <p className="font-bold text-slate-900 text-base mt-0.5">{selectedReport.judul_laporan || selectedReport.judul}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kategori</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedReport.nama_kategori || selectedReport.kategori}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kecamatan</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {selectedReport.nama_kecamatan || selectedReport.kecamatan || 'Lamongan'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deskripsi Masalah</span>
                  <p className="text-xs text-slate-700 mt-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                    {selectedReport.deskripsi_laporan || selectedReport.deskripsi || 'Tidak ada deskripsi rinci.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pelapor</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedReport.nama_lengkap || 'Warga Lamongan'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Waktu Masuk</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      {new Date(selectedReport.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {selectedReport.tanggapan && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Catatan Tanggapan / Penolakan</span>
                    <p className="text-xs text-rose-800 mt-1 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed">
                      {selectedReport.tanggapan}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            {selectedReport.status_terkini === 'Menunggu Verifikasi' && (
              <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => {
                    const r = selectedReport;
                    setSelectedReport(null);
                    openAction(r, 'reject');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  Tolak Laporan
                </button>
                <button
                  onClick={() => {
                    const r = selectedReport;
                    setSelectedReport(null);
                    openAction(r, 'accept');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  Verifikasi & Terima
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modern Action Confirmation Dialog (Accept / Reject) */}
      {actionReport && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1500] p-4"
          onClick={() => !submitting && closeAction()}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                actionType === 'reject' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {actionType === 'reject' ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {actionType === 'reject' ? 'Tolak Laporan Masuk' : 'Verifikasi & Terima Laporan'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {actionType === 'reject'
                    ? 'Laporan akan ditandai Ditolak dan warga akan menerima alasan penolakan.'
                    : 'Laporan telah diverifikasi keabsahannya dan akan diteruskan ke tim dinas.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-800 truncate">{actionReport.judul_laporan || actionReport.judul || 'Tanpa Judul'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                <span className="font-mono text-blue-600 font-bold">#{reportId(actionReport)}</span>
                {' · '}{actionReport.nama_lengkap || 'Warga'}
              </p>
            </div>

            {actionType === 'reject' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Alasan Penolakan (Wajib Diisi)
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Lokasi berada di luar kewenangan Kabupaten Lamongan atau bukti foto buram..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={closeAction}
                disabled={submitting}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={confirmAction}
                disabled={submitting || (actionType === 'reject' && !rejectReason.trim())}
                className={`flex-1 py-2.5 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'reject' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {submitting ? 'Menyimpan...' : (actionType === 'reject' ? 'Konfirmasi Tolak' : 'Konfirmasi Terima')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TriageReportsPage;
