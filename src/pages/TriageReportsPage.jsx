import React, { useState } from 'react';
import {
  Search, ChevronDown, CheckCircle2, Clock, AlertCircle, FileText, Download, Eye, X, MapPin
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
    navigate('/admin-login');
    setLogoutOpen(false);
  };

  const cancelLogout = () => setLogoutOpen(false);

  const filteredReports = reports.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchSearch = searchTerm === '' ||
      String(r.id_laporan || r.ticket_code || '').toLowerCase().includes(term) ||
      String(r.judul_laporan || r.judul || '').toLowerCase().includes(term) ||
      String(r.nama_lengkap || r.pelapor || '').toLowerCase().includes(term);
    
    const matchStatus = filterStatus === '' || r.status_terkini === filterStatus;
    return matchSearch && matchStatus;
  });

  const reportId = (r) => r.id_laporan || r.ticket_code || r.id;

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
    const kewenangan = isReject ? 'Dinas PU' : null; // null untuk Terima, default untuk Tolak

    setSubmitting(true);
    try {
      await laporanAPI.updateStatus(id, newStatus, reason, kewenangan);
      setReports(prev => prev.map(r =>
        reportId(r) === id
          ? { ...r, status: newStatus, status_terkini: newStatus, ...(isReject ? { tanggapan: reason } : {}) }
          : r
      ));
      toast.success(isReject ? 'Laporan ditolak' : 'Laporan diterima');
      closeAction();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && reports.length === 0) return <LoadingScreen message="Memuat triage reports..." className="bg-slate-100" />;

  if (error && reports.length === 0) return <ErrorState message={error} onRetry={reload} className="bg-slate-100" />;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Menunggu Verifikasi': return 'bg-amber-50 text-amber-700';
      case 'Diterima': return 'bg-blue-50 text-blue-700';
      case 'Selesai': return 'bg-emerald-50 text-emerald-700';
      case 'Ditolak': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  const getStatusDotColor = (status) => {
    switch(status) {
      case 'Menunggu Verifikasi': return 'bg-amber-500';
      case 'Diterima': return 'bg-blue-500';
      case 'Selesai': return 'bg-emerald-500';
      case 'Ditolak': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <AdminSidebar activePath="/admin/triage" onLogout={handleLogout} />
      <LogoutConfirm 
        isOpen={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onConfirm={confirmLogout} 
      />

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
              <option value="Ditolak">Ditolak</option>
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
                    <tr key={report.id_laporan || report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-blue-600">{report.id_laporan}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-800">{report.nama_lengkap}</p>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <p className="font-medium text-slate-800 truncate">{report.judul_laporan}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-xs text-slate-600">{report.nama_kategori}</p>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status_terkini)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(report.status_terkini)}`} />
                          {report.status_terkini || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          {report.status_terkini === 'Menunggu Verifikasi' ? (
                            <>
                              <button
                                onClick={() => openAction(report, 'accept')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Terima
                              </button>
                              <button
                                onClick={() => openAction(report, 'reject')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                Tolak
                              </button>
                            </>
                          ) : report.status_terkini === 'Diterima' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Diterima
                            </span>
                          ) : report.status_terkini === 'Ditolak' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                              <X className="w-3.5 h-3.5" />
                              Ditolak
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold">
                              {report.status_terkini || '-'}
                            </span>
                          )}
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
              <EmptyState message="Tidak ada laporan" subMessage="Tidak ada laporan yang sesuai dengan filter yang dipilih" />
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1500] p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-lg">Detail Laporan - {selectedReport.id_laporan}</h3>
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-70px)]">
              {/* Image on left */}
              <div className="relative md:w-1/2 flex-shrink-0">
                <div className="w-full h-full min-h-[300px] md:min-h-[400px] relative">
                  <ImageWithFallback 
                    src={selectedReport.foto_bukti} 
                    alt="Bukti laporan"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Details on right */}
              <div className="p-6 md:w-1/2 overflow-y-auto">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Judul & Kategori</p>
                    <p className="font-semibold text-slate-900 text-base mt-1">{selectedReport.judul_laporan}</p>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mt-2">
                      {selectedReport.nama_kategori}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Kecamatan & Lokasi</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{selectedReport.nama_kecamatan}, Lamongan</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Deskripsi</p>
                    <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{selectedReport.deskripsi_laporan}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Pelapor</p>
                      <p className="font-medium text-slate-800 mt-1">{selectedReport.nama_lengkap}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tanggal Laporan</p>
                      <p className="font-medium text-slate-800 mt-1">
                        {new Date(selectedReport.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  {selectedReport.status_terkini && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Status Saat Ini</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${getStatusColor(selectedReport.status_terkini)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(selectedReport.status_terkini)}`} />
                          {selectedReport.status_terkini}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi Terima / Tolak */}
      {actionReport && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1500] p-4"
          onClick={() => !submitting && closeAction()}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                actionType === 'reject' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {actionType === 'reject' ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {actionType === 'reject' ? 'Tolak Laporan' : 'Terima Laporan'}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {actionType === 'reject'
                    ? 'Laporan akan ditandai sebagai Ditolak. Berikan alasan penolakan.'
                    : 'Laporan akan diverifikasi dan ditandai sebagai Diterima.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-sm font-semibold text-slate-800 truncate">{actionReport.judul_laporan || 'Tanpa Judul'}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                <span className="font-mono text-blue-600 font-medium">{reportId(actionReport)}</span>
                {' · '}{actionReport.nama_lengkap || '-'}
              </p>
            </div>

            {actionType === 'reject' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Tuliskan alasan mengapa laporan ini ditolak..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={closeAction}
                disabled={submitting}
                className="flex-1 py-3 border border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={confirmAction}
                disabled={submitting || (actionType === 'reject' && !rejectReason.trim())}
                className={`flex-1 py-3 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {submitting ? 'Memproses...' : (actionType === 'reject' ? 'Tolak Laporan' : 'Terima Laporan')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TriageReportsPage;
