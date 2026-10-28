import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  X,
  Check,
  MessageSquare,
  Maximize2
} from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import { useReportStore } from '../stores/useReportStore';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import PullToRefresh from '../components/ui/PullToRefresh';

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

function timeAgo(dateStr) {
  if (!dateStr) return '-';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Baru saja';
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [expandedId, setExpandedId] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { reports, loading, error, fetchReports } = useReportStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusStyle = (status) => {
    return STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  // Dynamic status counters
  const totalReportsCount = reports.length;
  const waitingCount = reports.filter(r => r.status === 'Menunggu Verifikasi').length;
  const inProgressCount = reports.filter(r => r.status === 'Diterima' || r.status === 'Sedang Diproses').length;
  const completedCount = reports.filter(r => r.status === 'Selesai').length;
  const rejectedCount = reports.filter(r => r.status === 'Ditolak').length;

  const filterTabs = [
    { id: 'Semua', label: 'Semua', count: totalReportsCount },
    { id: 'Menunggu', label: 'Menunggu', count: waitingCount },
    { id: 'Diproses', label: 'Diproses', count: inProgressCount },
    { id: 'Selesai', label: 'Selesai', count: completedCount },
    { id: 'Ditolak', label: 'Ditolak', count: rejectedCount },
  ];

  const filteredReports = reports.filter((report) => {
    // Filter status
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

    // Search query
    const query = searchQuery.trim().toLowerCase();
    const matchQuery = !query ||
      (report.ticket_code && String(report.ticket_code).toLowerCase().includes(query)) ||
      (report.judul && report.judul.toLowerCase().includes(query)) ||
      (report.deskripsi && report.deskripsi.toLowerCase().includes(query)) ||
      (report.kecamatan && report.kecamatan.toLowerCase().includes(query)) ||
      (report.kategori && report.kategori.toLowerCase().includes(query));

    return matchStatus && matchQuery;
  });

  if (loading && !refreshing && reports.length === 0) {
    return <LoadingScreen message="Memuat riwayat laporan..." />;
  }

  if (error && !refreshing && reports.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} withNav />;
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 relative font-sans">
        {/* Header - Gradient Senada dengan HomePage */}
        <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-8 pb-10 rounded-b-3xl relative overflow-hidden shadow-sm">
          {/* Aksen Dekorasi Transparan */}
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

        {/* Search Bar - Mengambang Halus */}
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
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        {/* Filter Pills Status */}
        <div className="px-5 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterTabs.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar Kartu Laporan */}
        <div className="px-5 mt-4 space-y-3">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => {
              const isExpanded = expandedId === report.id;
              const isRejected = report.status === 'Ditolak';

              // Step tracking progress
              let currentStepIndex = STATUS_PROGRESS_ORDER.indexOf(report.status);
              if (currentStepIndex === -1 && !isRejected) currentStepIndex = 0;

              return (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:border-slate-200 transition-all"
                >
                  {/* Bagian Ringkasan Kartu */}
                  <div
                    onClick={() => toggleExpand(report.id)}
                    className="p-3.5 flex gap-3 items-start cursor-pointer select-none"
                  >
                    {/* Foto Bukti / Placeholder */}
                    <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 relative group">
                      {report.foto ? (
                        <img
                          src={report.foto}
                          alt={report.judul}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-slate-300" />
                      )}
                    </div>

                    {/* Informasi Utama */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-mono font-bold text-blue-600">
                          #{report.ticket_code || report.id}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusStyle(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {report.judul}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[120px] text-slate-500">
                            {report.kecamatan}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{timeAgo(report.tanggal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Indikator Expand */}
                    <div className="pt-1 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Detail Expanded */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-1 duration-200">
                      {/* Timeline Alur Progres Laporan */}
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-600 mb-2.5">
                          Status Penanganan
                        </p>

                        {isRejected ? (
                          <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span>Laporan Ditolak / Tidak Memenuhi Syarat</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-1 relative">
                            {STATUS_PROGRESS_ORDER.map((step, idx) => {
                              const isCompleted = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;

                              const stepLabels = ['Terkirim', 'Diterima', 'Diproses', 'Selesai'];

                              return (
                                <div key={step} className="flex flex-col items-center text-center">
                                  {/* Lingkaran Step */}
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                                      isCompleted
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-200 text-slate-400'
                                    } ${isCurrent ? 'ring-2 ring-blue-300' : ''}`}
                                  >
                                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                                  </div>
                                  <span
                                    className={`text-[10px] leading-tight ${
                                      isCurrent
                                        ? 'font-bold text-blue-600'
                                        : isCompleted
                                        ? 'font-medium text-slate-700'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {stepLabels[idx]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
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

                      {/* Tanggapan Petugas Lapangan (jika ada) */}
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
                              Ditanggapi pada: {new Date(report.tanggal_tanggapan).toLocaleString('id-ID')}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Waktu Pelaporan & Preview Foto */}
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
                        <span>
                          Dibuat:{' '}
                          {report.created_at
                            ? new Date(report.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '-'}
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
            })
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