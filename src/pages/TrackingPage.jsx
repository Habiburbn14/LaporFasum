import React from 'react';
import { Search, MapPin, Clock, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import { INITIAL_REPORTS } from '../utils/mockData';

const STATUS_STYLES = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700',
  Diterima: 'bg-blue-100 text-blue-700',
  Selesai: 'bg-emerald-100 text-emerald-700',
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'Baru saja';
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

function TrackingPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedId, setExpandedId] = React.useState(null);

  const filteredReports = INITIAL_REPORTS.filter(report => 
    report.ticket_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.judul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28">
      <header className="bg-white px-5 pt-8 pb-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Riwayat Laporan</h1>
        <p className="text-sm text-slate-500">Kelola semua laporan Anda</p>
      </header>

      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex items-center gap-2">
          <Search className="w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari tiket atau judul laporan..."
            className="flex-grow text-sm outline-none text-slate-700 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const isExpanded = expandedId === report.id;
            return (
              <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <button
                  onClick={() => toggleExpand(report.id)}
                  className="w-full p-4 flex gap-3 items-start text-left"
                >
                  <img
                    src={report.foto}
                    alt={report.judul}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-2">{report.judul}</p>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[report.status]}`}>
                      {report.status}
                    </span>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{report.kecamatan}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo(report.tanggal)}</span>
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Kode Tiket</p>
                      <p className="text-sm text-slate-600">{report.ticket_code}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">Kategori</p>
                      <p className="text-sm text-slate-600">{report.kategori}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                        Deskripsi Laporan
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">{report.deskripsi}</p>
                    </div>

                    <div className="relative pt-4">
                      <p className="text-xs font-semibold text-slate-700 mb-3">Progress Penanganan</p>
                      <div className="flex justify-between items-start px-2 relative">
                        {['Menunggu Verifikasi', 'Diterima', 'Selesai'].map((status, index) => {
                          const isActive = report.status === status;
                          const isPassed = ['Menunggu Verifikasi', 'Diterima', 'Selesai'].indexOf(report.status) >= index;
                          return (
                            <div key={status} className="flex flex-col items-center relative z-10 flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all text-xs font-semibold ${
                                isActive 
                                  ? 'bg-emerald-600 text-white shadow-md' 
                                  : isPassed 
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : 'bg-slate-200 text-slate-400'
                              }`}>
                                {index + 1}
                              </div>
                              <span className={`text-[10px] font-medium text-center leading-tight ${
                                isActive ? 'text-emerald-700' : isPassed ? 'text-emerald-600' : 'text-slate-400'
                              }`}>
                                {status}
                              </span>
                            </div>
                          );
                        })}
                        <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm">Tidak ada laporan ditemukan</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default TrackingPage;
