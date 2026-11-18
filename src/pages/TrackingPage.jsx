import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ChevronDown,
  RefreshCw,
  X,
  Check,
  MessageSquare,
  Maximize2,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import { useReportStore } from '../stores/useReportStore';
import { useAuthStore } from '../stores/useAuthStore';
import { laporanAPI } from '../services/api';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PullToRefresh from '../components/ui/PullToRefresh';
import { timeAgo, formatDateFull } from '../utils/date';

const STATUS_STYLES = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700 border-amber-200/60',
  'Diterima': 'bg-blue-100 text-blue-700 border-blue-200/60',
  'Sedang Diproses': 'bg-purple-100 text-purple-700 border-purple-200/60',
  'Selesai': 'bg-emerald-100 text-emerald-700 border-emerald-200/60',
  'Ditolak': 'bg-red-100 text-red-700 border-red-200/60',
};

const STATUS_PROGRESS_ORDER = [
  'Menunggu Verifikasi',
  'Diterima',
  'Sedang Diproses',
  'Selesai'
];

function TrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [expandedId, setExpandedId] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [singleReport, setSingleReport] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState(null);
  const { user } = useAuthStore();

  const { reports, loading, error, fetchReports } = useReportStore();

  const reportList = Array.isArray(reports)
    ? reports
    : Array.isArray(reports?.data)
    ? reports.data
    : [];

  const fetchSingleReport = useCallback(async () => {
    if (!id) return;
    setSingleLoading(true);
    setSingleError(null);
    try {
      const result = await laporanAPI.getById(id);
      const r = result?.data?.data || result?.data || (result?.id_laporan ? result : null);

      if (r && result?.success !== false) {
        const mapped = {
          id: r.id_laporan,
          ticket_code: r.id_laporan,
          judul: r.judul_laporan || r.judul || 'Tanpa Judul',
          deskripsi: r.deskripsi_laporan || r.deskripsi || '',
          status: r.status_terkini || r.status || 'Menunggu Verifikasi',
          foto: r.foto_bukti || '',
          kategori: r.nama_kategori || r.kategori || 'Lainnya',
          kecamatan: r.nama_kecamatan || r.kecamatan || '-',
          tanggal: r.created_at || '',
          created_at: r.created_at || '',
          tanggapan: r.tanggapan_admin || r.tanggapan || null,
          tanggal_tanggapan: r.tanggal_tanggapan || null,
          lat: r.lat ?? r.latitude,
          lng: r.lng ?? r.longitude,
          nama_lengkap: r.nama_lengkap,
          nik: r.nik,
          email: r.email,
          status_terkini: r.status_terkini,
          status_perawatan: r.status_perawatan,
          status_keamanan: r.status_keamanan,
          status_prioritas: r.status_prioritas,
        };
        setSingleReport(mapped);
      } else {
        setSingleError('Gagal memuat detail laporan');
      }
    } catch (err) {
      setSingleError(err.message || 'Gagal memuat detail laporan');
    } finally {
      setSingleLoading(false);
    }
  }, [id]);

  // Fetch single report when :id param exists
  useEffect(() => {
    if (id) {
      fetchSingleReport();
    } else {
      setSingleReport(null);
      setSingleError(null);
    }
  }, [id, fetchSingleReport]);

  useEffect(() => {
    if (!id) {
      fetchReports();
    }
  }, [fetchReports, id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  const toggleExpand = (reportId) => {
    setExpandedId((prev) => (prev === reportId ? null : reportId));
  };

  const getStatusStyle = (status) => {
    return STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  // Single Report Detail View
  if (id) {
    if (singleLoading) {
      return (
        <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 font-sans flex flex-col">
          <header className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10">
            <button
              onClick={() => navigate('/tracking')}
              className="flex items-center gap-1 text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-slate-900 text-sm flex-1 text-center -ml-6">Detail Laporan</h1>
          </header>
          <main className="flex-1 p-4 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-sm">Memuat detail laporan...</span>
            </div>
          </main>
          <BottomNav />
        </div>
      );
    }

    if (singleError) {
      return (
        <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 font-sans flex flex-col">
          <header className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10">
            <button
              onClick={() => navigate('/tracking')}
              className="flex items-center gap-1 text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-slate-900 text-sm flex-1 text-center -ml-6">Detail Laporan</h1>
          </header>
          <main className="flex-1 p-4 flex items-center justify-center">
            <ErrorState message={singleError} onRetry={fetchSingleReport} withNav />
          </main>
          <BottomNav />
        </div>
      );
    }

    if (!singleReport) {
      return null;
    }

    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 font-sans">
        <header className="bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => navigate('/tracking')}
            className="flex items-center gap-1 text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-slate-900 text-sm flex-1 text-center -ml-6">Detail Laporan</h1>
        </header>

        <div className="p-4 space-y-4 pb-24">
          {/* Status & Title */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-slate-900 text-base truncate">{singleReport.judul}</h2>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(singleReport.status)} mt-1`}>
                  {singleReport.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{singleReport.kecamatan || 'Lamongan'}, Lamongan</span>
            </div>
            <p className="text-[11px] text-slate-500">{timeAgo(singleReport.tanggal)}</p>
          </div>

          {/* Photo */}
          {singleReport.foto && (
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <img
                src={singleReport.foto}
                alt="Bukti Laporan"
                className="w-full h-52 object-cover"
              />
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
                Foto Bukti Laporan
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-900 text-sm mb-2">Deskripsi Masalah</h3>
            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
              {singleReport.deskripsi || 'Tidak ada deskripsi rinci.'}
            </p>
          </div>

          {/* Response */}
          {singleReport.tanggapan && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-xs mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Tanggapan Dinas</span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">{singleReport.tanggapan}</p>
              {singleReport.tanggal_tanggapan && (
                <p className="text-[10px] text-blue-500 mt-2">
                  Ditanggapi pada: {formatDateFull(singleReport.tanggal_tanggapan)}
                </p>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium mb-0.5">Kategori</p>
                <p className="font-semibold text-slate-700 truncate">{singleReport.kategori || '-'}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium mb-0.5">Pelapor</p>
                <p className="font-semibold text-slate-700 truncate">{singleReport.nama_lengkap || '-'}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium mb-0.5">NIK</p>
                <p className="font-mono font-semibold text-slate-700 truncate">{singleReport.nik || '-'}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium mb-0.5">Waktu Lapor</p>
                <p className="font-semibold text-slate-700 truncate">{singleReport.tanggal ? formatDateFull(singleReport.tanggal) : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  if (loading && !refreshing && reportList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 relative font-sans flex flex-col">
        <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-8 pb-10 rounded-b-3xl relative overflow-hidden shadow-sm">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute bottom-1 left-4 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Riwayat Laporan
              </h1>
              <p className="text-xs text-blue-100 mt-1">
                Pantau perkembangan dan penanganan aduan Anda
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur active:scale-95 transition flex items-center justify-center text-white disabled:opacity-50"
              title="Perbarui data"
            >
              <RefreshCw className={`w-4.5 h-4.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm">Memuat riwayat laporan...</span>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  if (error && !refreshing && reportList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 relative font-sans flex flex-col">
        <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-8 pb-10 rounded-b-3xl relative overflow-hidden shadow-sm">
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Riwayat Laporan
              </h1>
              <p className="text-xs text-blue-100 mt-1">
                Pantau perkembangan dan penanganan aduan Anda
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur active:scale-95 transition flex items-center justify-center text-white disabled:opacity-50"
              title="Perbarui data"
            >
              <RefreshCw className={`w-4.5 h-4.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 flex items-center justify-center">
          <ErrorState message={error} onRetry={handleRefresh} withNav />
        </main>

        <BottomNav />
      </div>
    );
  }

  // Dynamic status counters
  const totalReportsCount = reportList.length;
  const waitingCount = reportList.filter((r) => r.status === 'Menunggu Verifikasi').length;
  const inProgressCount = reportList.filter((r) => r.status === 'Diterima' || r.status === 'Sedang Diproses').length;
  const completedCount = reportList.filter((r) => r.status === 'Selesai').length;
  const rejectedCount = reportList.filter((r) => r.status === 'Ditolak').length;

  const filterTabs = [
    { id: 'Semua', label: 'Semua', count: totalReportsCount },
    { id: 'Menunggu', label: 'Menunggu', count: waitingCount },
    { id: 'Diproses', label: 'Diproses', count: inProgressCount },
    { id: 'Selesai', label: 'Selesai', count: completedCount },
    { id: 'Ditolak', label: 'Ditolak', count: rejectedCount },
  ];

  const filteredReports = reportList.filter((report) => {
    let matchStatus = true;
    if (statusFilter === 'Menunggu') {
      matchStatus = report.status === 'Menunggu Verifikasi';
    } else if (statusFilter === 'Diproses') {
      matchStatus = report.status === 'Diterima' || report.status === 'Sedang Diproses';
    } else if (statusFilter === 'Selesai') {
      matchStatus = report.status === 'Selesai';
    } else if (statusFilter === 'Ditolak') {
      matchStatus = report.status === 'Ditolak';
    }

    const query = searchQuery.trim().toLowerCase();
    const matchQuery =
      !query ||
      (report.ticket_code && String(report.ticket_code).toLowerCase().includes(query)) ||
      (report.judul && report.judul.toLowerCase().includes(query)) ||
      (report.deskripsi && report.deskripsi.toLowerCase().includes(query)) ||
      (report.kecamatan && report.kecamatan.toLowerCase().includes(query)) ||
      (report.kategori && report.kategori.toLowerCase().includes(query));

    return matchStatus && matchQuery;
  });

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 relative font-sans">
        {/* Header */}
        <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-8 pb-10 rounded-b-3xl relative overflow-hidden shadow-sm">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute bottom-1 left-4 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Riwayat Laporan
              </h1>
              <p className="text-xs text-blue-100 mt-1">
                Pantau perkembangan dan penanganan aduan Anda
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur active:scale-95 transition flex items-center justify-center text-white disabled:opacity-50"
              title="Perbarui data"
            >
              <RefreshCw className={`w-4.5 h-4.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative -mt-5 px-5 z-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2.5 flex items-center gap-2.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
            <Search className="w-4.5 h-4.5 text-slate-400 ml-1 shrink-0" />
            <input
              type="text"
              placeholder="Cari tiket, judul, atau kecamatan..."
              className="grow text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-4 pb-2 mt-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                }`}
              >
                {tab.label}{' '}
                <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Report List */}
        <div className="px-4 pb-4">
          {filteredReports.length > 0 ? (
            <div className="space-y-3">
              {filteredReports.map((report) => {
                const itemId = report.id || report.ticket_code;
                return (
                  <div
                    key={itemId}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-slate-200 hover:shadow-md transition-all"
                  >
                    {/* Card Header */}
                    <div className="p-3 border-b border-slate-100 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={report.foto}
                            alt={report.judul}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                            onError={(e) => {
                              e.target.src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect fill="%23E2E8F0" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="%2394A3B8"%3E📷%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                            {report.judul}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{report.deskripsi}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(
                          report.status
                        )} shrink-0`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {/* Expandable Content */}
                    <button
                      onClick={() => toggleExpand(itemId)}
                      className="w-full px-3 py-2 text-left transition-colors"
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 mx-auto block ${
                          expandedId === itemId ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedId === itemId && (
                      <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
                        {/* Photo Full Width */}
                        {report.foto && (
                          <img
                            src={report.foto}
                            alt={report.judul}
                            className="w-full h-48 object-cover rounded-xl shadow-sm cursor-pointer"
                            onClick={() => setPreviewPhoto(report.foto)}
                          />
                        )}

                        {/* Progress Timeline */}
                        <div className="space-y-2">
                          {STATUS_PROGRESS_ORDER.map((status, index) => {
                            const statusIndex = STATUS_PROGRESS_ORDER.findIndex((s) => s === report.status);
                            const isCompleted = index < statusIndex;
                            const isCurrent = index === statusIndex;
                            return (
                              <div key={status} className="flex items-center gap-3">
                                <div
                                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 transition-all ${
                                    isCompleted
                                      ? 'bg-emerald-500 border-emerald-500 text-white'
                                      : isCurrent
                                      ? 'bg-blue-50 border-blue-500 text-blue-600'
                                      : 'bg-slate-200 border-slate-200 text-slate-400'
                                  }`}
                                >
                                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                                </div>
                                <div className="flex-1 h-0.5 bg-slate-200 rounded-full" />
                                <span
                                  className={`text-xs font-medium w-28 text-right shrink-0 ${
                                    isCompleted ? 'text-emerald-600' : isCurrent ? 'text-blue-600' : 'text-slate-400'
                                  }`}
                                >
                                  {status}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Info Detail Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-medium mb-0.5">Kategori</p>
                            <p className="font-semibold text-slate-700 truncate">{report.kategori || '-'}</p>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-medium mb-0.5">Kecamatan</p>
                            <p className="font-semibold text-slate-700 truncate">{report.kecamatan || '-'}</p>
                          </div>
                        </div>

                        {/* Deskripsi Laporan */}
                        <div>
                          <p className="text-[11px] font-semibold text-slate-600 mb-1">
                            Deskripsi Keluhan
                          </p>
                          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                            {report.deskripsi || 'Tidak ada deskripsi rinci.'}
                          </p>
                        </div>

                        {/* Tanggapan Petugas Lapangan */}
                        {report.tanggapan && (
                          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-xs mb-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Tanggapan Petugas Lapangan</span>
                            </div>
                            <p className="text-xs text-blue-900 leading-relaxed">
                              {report.tanggapan}
                            </p>
                            {report.tanggal_tanggapan && (
                              <p className="text-[10px] text-blue-500 mt-1.5">
                                Ditanggapi pada: {formatDateFull(report.tanggal_tanggapan)}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Waktu Pelaporan & Preview Foto */}
                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
                          <span>
                            Dibuat: {report.created_at ? formatDateFull(report.created_at) : '-'}
                          </span>
                          {report.foto && (
                            <button
                              onClick={() => setPreviewPhoto(report.foto)}
                              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline text-xs"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Lihat Foto</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <EmptyState
                message="Tidak ada laporan"
                subMessage={
                  searchQuery || statusFilter !== 'Semua'
                    ? 'Tidak ditemukan laporan yang sesuai dengan pencarian atau filter Anda.'
                    : 'Anda belum memiliki riwayat laporan aduan fasilitas.'
                }
              />
              {(searchQuery || statusFilter !== 'Semua') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('Semua');
                  }}
                  className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 transition"
                >
                  Reset Pencarian & Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Preview Foto Penuh */}
        {previewPhoto && (
          <div
            onClick={() => setPreviewPhoto(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl relative"
            >
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">Foto Bukti Laporan</span>
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-slate-900 max-h-[70vh] flex items-center justify-center overflow-hidden">
                <img
                  src={previewPhoto}
                  alt="Bukti Laporan Penuh"
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </PullToRefresh>
  );
}

export default TrackingPage;