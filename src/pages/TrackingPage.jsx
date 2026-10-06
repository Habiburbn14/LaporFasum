import React, { useState } from 'react';
import { Search, MapPin, Clock, ChevronDown, ChevronUp, AlertCircle, Layers, Eye, X } from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import CustomMap from '../components/CustomMap';
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
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  // Map control states
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [baseMap, setBaseMap] = useState('openstreetmap');
  const [activeLayers, setActiveLayers] = useState({
    arteriPrimer: false,
    kolektorPrimer1: false,
    kolektorPrimer2: false,
    kolektorPrimer3: false,
    arteriSecondary: false,
    kolektorSecondary: false,
    lingkunganPrimary: false,
    lingkunganSecondary: false,
    lokalPrimary: false,
    lokalSecondary: false,
  });
  const [reportFilter, setReportFilter] = useState('all');
  const [selectedReportOnMap, setSelectedReportOnMap] = useState(null);

  const reports = INITIAL_REPORTS;

  const filteredReports = reports.filter(report => 
    report.ticket_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.judul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 relative">
      {/* Header */}
      <header className="bg-white px-5 pt-8 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Riwayat Laporan</h1>
            <p className="text-sm text-slate-500">Kelola dan pantau laporan Anda</p>
          </div>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar (List)
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Peta (Map View)
          </button>
        </div>
      </header>

      {viewMode === 'list' ? (
        <>
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
                          <p className="text-xs font-semibold text-slate-700 mb-1">Deskripsi</p>
                          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">{report.deskripsi}</p>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button 
                            onClick={() => {
                              setViewMode('map');
                              setSelectedReportOnMap(report);
                            }}
                            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Lihat di Peta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Tidak ada laporan ditemukan</p>
                <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* MAP VIEW MODE */
        <div className="relative w-full h-[calc(100vh-190px)] bg-slate-200">
          {/* Floating Control Button (Top Right) */}
          <div className="absolute top-4 right-4 z-[400]">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="w-11 h-11 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all"
              title="Layer & Filter Peta"
            >
              <Layers className="w-5 h-5 text-blue-600" />
            </button>

            {/* Floating Layer Menu Popup */}
            {showLayerMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-[500] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Pengaturan Peta</h3>
                  <button onClick={() => setShowLayerMenu(false)} className="text-xs text-slate-400 hover:text-slate-700 font-medium">Tutup</button>
                </div>

                {/* Base Map Options */}
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Layer Dasar</p>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="basemap" 
                        checked={baseMap === 'openstreetmap'} 
                        onChange={() => setBaseMap('openstreetmap')}
                        className="text-blue-600"
                      />
                      <span>Open Street Map</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="basemap" 
                        checked={baseMap === 'satellite'} 
                        onChange={() => setBaseMap('satellite')}
                        className="text-blue-600"
                      />
                      <span>World Imagery (Satelit)</span>
                    </label>
                  </div>
                </div>

                {/* Layer Jalan & Infrastruktur */}
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fungsi Jalan (SCALA)</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.arteriPrimer} 
                        onChange={() => toggleLayer('arteriPrimer')}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                      <span>Arteri Primer</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.kolektorPrimer1 || activeLayers.kolektorPrimer2 || activeLayers.kolektorPrimer3} 
                        onChange={() => {
                          const val = !(activeLayers.kolektorPrimer1 || activeLayers.kolektorPrimer2 || activeLayers.kolektorPrimer3);
                          setActiveLayers(prev => ({ ...prev, kolektorPrimer1: val, kolektorPrimer2: val, kolektorPrimer3: val }));
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                      <span>Kolektor Primer</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.arteriSecondary} 
                        onChange={() => toggleLayer('arteriSecondary')}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                      <span>Arteri Sekunder</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.kolektorSecondary} 
                        onChange={() => toggleLayer('kolektorSecondary')}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                      <span>Kolektor Sekunder</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.lingkunganPrimary || activeLayers.lingkunganSecondary} 
                        onChange={() => {
                          const val = !(activeLayers.lingkunganPrimary || activeLayers.lingkunganSecondary);
                          setActiveLayers(prev => ({ ...prev, lingkunganPrimary: val, lingkunganSecondary: val }));
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span>Lingkungan</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.lokalPrimary || activeLayers.lokalSecondary} 
                        onChange={() => {
                          const val = !(activeLayers.lokalPrimary || activeLayers.lokalSecondary);
                          setActiveLayers(prev => ({ ...prev, lokalPrimary: val, lokalSecondary: val }));
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                      <span>Lokal</span>
                    </label>
                  </div>
                </div>
                </div>

                {/* Filter Laporan */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Filter Marker</p>
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setReportFilter('all')}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                        reportFilter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setReportFilter('mine')}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                        reportFilter === 'mine' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Laporan Saya
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Map Component */}
          <CustomMap
            reports={reports}
            activeLayers={activeLayers}
            baseMap={baseMap}
            onMarkerClick={setSelectedReportOnMap}
            selectedReport={selectedReportOnMap}
          />

          {/* Bottom Sheet Detail (Slide Up when marker clicked) */}
          {selectedReportOnMap && (
            <div className="absolute inset-x-0 bottom-0 z-[1000] p-4 bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-200">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3"></div>
              <div className="flex gap-3 items-start mb-3">
                <img
                  src={selectedReportOnMap.foto}
                  alt={selectedReportOnMap.judul}
                  className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-600">{selectedReportOnMap.ticket_code}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[selectedReportOnMap.status]}`}>
                      {selectedReportOnMap.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 line-clamp-1">{selectedReportOnMap.judul}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedReportOnMap.kategori}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{selectedReportOnMap.kecamatan}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedReportOnMap(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setViewMode('list');
                    setExpandedId(selectedReportOnMap.id);
                    setSelectedReportOnMap(null);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Lihat Detail
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default TrackingPage;
