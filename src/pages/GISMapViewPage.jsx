import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut,
  Bell, Layers, X, ChevronDown, MapPin, Eye, AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/mobile/BottomNav';
import CustomMap from '../components/CustomMap';
import { useReportStore } from '../stores/useReportStore';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorState from '../components/ui/ErrorState';
import { getErrorMessage } from '../utils/error';

const STATUS_STYLES = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700 border-amber-200/60',
  'Diterima': 'bg-blue-100 text-blue-700 border-blue-200/60',
  'Sedang Diproses': 'bg-purple-100 text-purple-700 border-purple-200/60',
  'Selesai': 'bg-emerald-100 text-emerald-700 border-emerald-200/60',
  'Ditolak': 'bg-red-100 text-red-700 border-red-200/60',
};

function GISMapViewPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  // Admin state
  const [viewMode, setViewMode] = useState('default');
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [lamonganData, setLamonganData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);

  // Citizen map states
  const [reportFilter, setReportFilter] = useState('all');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [baseMap, setBaseMap] = useState('openstreetmap');
  const [selectedReportOnMap, setSelectedReportOnMap] = useState(null);
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

  const { reports, mapReports, fetchReports, fetchAllReports, fetchMapPoints } = useReportStore();

  // Map center for Lamongan (Admin)
  const center = [-7.169249504786527, 112.33849173392773];
  const zoom = 11;

  // Boundary style - red outline, transparent fill (Admin)
  const boundaryStyle = {
    color: '#ef4444',
    weight: 3,
    opacity: 1,
    fillOpacity: 0,
    lineCap: 'round',
    lineJoin: 'round',
  };

  // Load admin boundary if in admin mode
  useEffect(() => {
    if (!isAdmin) return;

    const fetchLamonganBoundary = async () => {
      try {
        setAdminLoading(true);
        setAdminError(null);
        const response = await fetch('/lamongan.geojson');
        if (!response.ok) {
          throw new Error(`Gagal memuat file GeoJSON (HTTP ${response.status})`);
        }
        const data = await response.json();
        setLamonganData(data);
      } catch (err) {
        console.error('Error loading Lamongan boundary:', err);
        setAdminError(getErrorMessage(err));
      } finally {
        setAdminLoading(false);
      }
    };

    fetchLamonganBoundary();
  }, [isAdmin]);

  // Load citizen reports and points on mount
  useEffect(() => {
    if (isAdmin) return;

    fetchMapPoints();
    if (reportFilter === 'mine') {
      fetchReports();
    } else {
      fetchAllReports();
    }
  }, [isAdmin, reportFilter, fetchMapPoints, fetchReports, fetchAllReports]);

  const toggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const getStatusStyle = (status) => {
    return STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (isAdmin && adminLoading) {
    return <LoadingScreen message="Memuat batas wilayah Lamongan..." />;
  }

  if (isAdmin && adminError) {
    return <ErrorState message={adminError} onRetry={() => window.location.reload()} />;
  }

  // Citizen Mobile Map View
  if (!isAdmin) {
    const displayedReports = reportFilter === 'mine'
      ? reports.filter((r) => r.lat && r.lng)
      : (mapReports.length > 0 ? mapReports : reports.filter((r) => r.lat && r.lng));

    return (
      <div className="h-screen w-full bg-slate-200 max-w-[430px] mx-auto flex flex-col relative overflow-hidden pb-20 font-sans">
        {/* Floating Top Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-[999] flex items-center gap-2">
          {/* Filter Switcher: Semua vs Laporan Saya */}
          <div className="flex-1 flex bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-slate-200/80">
            <button
              onClick={() => {
                setReportFilter('all');
                fetchAllReports();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                reportFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Laporan
            </button>
            <button
              onClick={() => {
                setReportFilter('mine');
                fetchReports();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                reportFilter === 'mine'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Laporan Saya
            </button>
          </div>

          {/* Tombol Layer Peta (SCALA & Base Map) */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              title="Pengaturan Layer & Infrastruktur"
            >
              <Layers className="w-5 h-5 text-blue-600" />
            </button>

            {/* Popup Menu Layer & Infrastruktur */}
            {showLayerMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-[1000] animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-160px)] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-bold text-slate-900 text-sm">Pengaturan Peta</h3>
                  <button
                    onClick={() => setShowLayerMenu(false)}
                    className="text-xs text-slate-400 hover:text-slate-700 font-medium"
                  >
                    Tutup
                  </button>
                </div>

                {/* Base Map Options */}
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Peta Dasar</p>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="citizen_basemap" 
                        checked={baseMap === 'openstreetmap'} 
                        onChange={() => setBaseMap('openstreetmap')}
                        className="text-blue-600"
                      />
                      <span>Open Street Map</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="citizen_basemap" 
                        checked={baseMap === 'satellite'} 
                        onChange={() => setBaseMap('satellite')}
                        className="text-blue-600"
                      />
                      <span>World Imagery (Satelit)</span>
                    </label>
                  </div>
                </div>

                {/* Layer Jalan & Infrastruktur SCALA */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fungsi Jalan (SCALA)</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.arteriPrimer} 
                        onChange={() => toggleLayer('arteriPrimer')}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shrink-0" />
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
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shrink-0" />
                      <span>Kolektor Primer</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.arteriSecondary} 
                        onChange={() => toggleLayer('arteriSecondary')}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shrink-0" />
                      <span>Arteri Sekunder</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeLayers.kolektorSecondary} 
                        onChange={() => toggleLayer('kolektorSecondary')}
                        className="rounded text-blue-600"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shrink-0" />
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
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
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
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block shrink-0" />
                      <span>Lokal</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Peta Interaktif (CustomMap) */}
        <div className="w-full h-full flex-1 relative">
          <CustomMap
            reports={displayedReports}
            activeLayers={activeLayers}
            baseMap={baseMap}
            onMarkerClick={(report) => setSelectedReportOnMap(report)}
            selectedReport={selectedReportOnMap}
          />
        </div>

        {/* Floating Bottom Card Preview saat Titik Laporan Diklik */}
        {selectedReportOnMap && (
          <div className="absolute bottom-22 left-4 right-4 z-[999] bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex gap-3 items-start mb-3">
              <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                {selectedReportOnMap.foto ? (
                  <img
                    src={selectedReportOnMap.foto}
                    alt={selectedReportOnMap.judul}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold text-blue-600">
                    #{selectedReportOnMap.ticket_code || selectedReportOnMap.id}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusStyle(
                      selectedReportOnMap.status
                    )}`}
                  >
                    {selectedReportOnMap.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 line-clamp-1">
                  {selectedReportOnMap.judul}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {selectedReportOnMap.kategori || 'Fasilitas Umum'}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedReportOnMap.kecamatan || 'Lamongan'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedReportOnMap(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  navigate('/tracking');
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                Lihat di Riwayat
              </button>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    );
  }

  // Admin View (Tetap Tidak Terganggu)
  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
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
          <button onClick={() => navigate('/admin/triage')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
            <ClipboardList className="w-5 h-5" />
            Triage Reports
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm">
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

      <div className="flex-1 ml-64 flex flex-col min-w-0 relative">
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">GIS Map View</h1>
              <p className="text-xs text-slate-500">Visualisasi sebaran ruas jalan</p>
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

        <main className="flex-1 relative">
          <MapContainer 
            center={center} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            {viewMode === 'satellite' ? (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution=""
              />
            ) : (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution=""
              />
            )}
            
            {lamonganData && (
              <GeoJSON
                data={lamonganData}
                style={boundaryStyle}
              />
            )}
            
            <ZoomControl position="topleft" />
          </MapContainer>

          <button
            onClick={() => setShowLayerControl(!showLayerControl)}
            className="absolute top-6 right-6 z-[1000] bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Layer Dasar
            <ChevronDown className={`w-4 h-4 transition-transform ${showLayerControl ? 'rotate-180' : ''}`} />
          </button>

          {showLayerControl && (
            <div className="absolute top-20 right-6 z-[1000] bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 max-h-[calc(100vh-140px)] overflow-y-auto">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-bold text-slate-900 text-sm">Layer Dasar</h3>
                <button
                  onClick={() => setShowLayerControl(false)}
                  className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-2">Peta Dasar</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="basemap"
                        checked={viewMode === 'default'}
                        onChange={() => setViewMode('default')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">Open Street Map</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="basemap"
                        checked={viewMode === 'satellite'}
                        onChange={() => setViewMode('satellite')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">World Imagery</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-slate-600 mb-3">Batas Wilayah</p>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => {}}
                        disabled
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span 
                        className="w-3 h-3 rounded-sm flex-shrink-0" 
                        style={{ backgroundColor: boundaryStyle.color }}
                      />
                      <span className="text-xs text-slate-700 flex-1">
                        Batas Kabupaten Lamongan
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default GISMapViewPage;