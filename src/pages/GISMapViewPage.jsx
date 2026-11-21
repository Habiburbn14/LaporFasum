import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Layers, X, ChevronDown, Crosshair, Route, Globe, User, AlertCircle, MapPin, Eye, Loader2, 
  Navigation, Home, Download, RefreshCw
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import BottomNav from '../components/mobile/BottomNav';
import CustomMap, { ROAD_LAYERS } from '../components/CustomMap';
import { useReportStore } from '../stores/useReportStore';
import { useAuthStore } from '../stores/useAuthStore';
import ErrorState from '../components/ui/ErrorState';
import { getErrorMessage } from '../utils/error';
import AdminSidebar from '../components/AdminSidebar';
import NotificationPopup from '../components/ui/NotificationPopup';
import { getRoadNetwork } from '../services/userApi';
import { findKecamatanByCoords } from '../utils/kecamatan';
import { roleOf, ROLE } from '../stores/useAuthStore';

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
  const { user } = useAuthStore();

  // Admin state
  const [viewMode, setViewMode] = useState('default');
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [lamonganData, setLamonganData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);

  // Citizen map states
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [baseMap, setBaseMap] = useState('openstreetmap');
  const [resetFocusTrigger, setResetFocusTrigger] = useState(0);
  const [selectedReportOnMap, setSelectedReportOnMap] = useState(null);
  const [layerLoading, setLayerLoading] = useState({});
  const [layerCounts, setLayerCounts] = useState({});
  
  // Admin GIS: show/hide all reports toggle
  const [showAllReports, setShowAllReports] = useState(false);
  
  // Initialize activeLayers from ROAD_LAYERS keys
  const initialActiveLayers = useMemo(() => {
    const layers = {};
    Object.keys(ROAD_LAYERS).forEach(key => { layers[key] = false; });
    return layers;
  }, []);
  
  const [activeLayers, setActiveLayers] = useState(initialActiveLayers);

  const { reports, mapReports, fetchReports, fetchMapPoints } = useReportStore();

  const userRole = roleOf(user);
  const isAdminKecamatan = userRole === ROLE.ADMIN_KECAMATAN;
  const isAdminKabupaten = userRole === ROLE.ADMIN_KABUPATEN;

  // Map center for Lamongan (Admin)
  const center = [-7.169249504786527, 112.33849173392773];
  const zoom = 11;

  // Boundary style - blue outline, transparent fill (Admin, sesuai theme)
  const boundaryStyle = {
    color: '#2563eb',
    weight: 3,
    opacity: 1,
    fillColor: '#2563eb',
    fillOpacity: 0.02,
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

  // Load reports
  useEffect(() => {
    if (isAdmin) {
      fetchMapPoints();
    } else {
      fetchReports();
    }
  }, [isAdmin, fetchMapPoints, fetchReports]);

  const toggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  // Fetch count dynamically when layer is checked/loaded
  const handleLayerLoadingChange = useCallback((layerKey, isLoading) => {
    setLayerLoading((prev) => ({
      ...prev,
      [layerKey]: isLoading,
    }));
  }, []);

  // Update counts when data arrives from CustomMap or fetch directly
  const fetchLayerCount = useCallback(async (layerKey) => {
    if (layerCounts[layerKey] !== undefined) return;
    try {
      const res = await getRoadNetwork(layerKey);
      if (res.success && res.pagination?.total !== undefined) {
        setLayerCounts(prev => ({ ...prev, [layerKey]: `${res.pagination.total} jalan` }));
      } else if (res.success && Array.isArray(res.data)) {
        setLayerCounts(prev => ({ ...prev, [layerKey]: `${res.data.length} jalan` }));
      }
    } catch {
      // ignore
    }
  }, [layerCounts]);

  const handleLocationFound = useCallback((coords) => {
    toast.dismiss('gps-locating');
    toast.success(`Lokasi ditemukan: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
  }, []);

  const handleLocationError = useCallback((err) => {
    toast.dismiss('gps-locating');
    let errorMsg = 'GPS tidak tersedia';
    if (err.code === 1) {
      errorMsg = 'Izin GPS ditolak. Aktifkan di pengaturan perangkat';
    } else if (err.code === 2) {
      errorMsg = 'Lokasi tidak dapat ditemukan. Cek sinyal GPS';
    } else if (err.code === 3) {
      errorMsg = 'Timeout mencari lokasi. Coba lagi';
    }
    toast.error(errorMsg);
  }, []);

  // Improved GPS handler with better accuracy and auto-detect kecamatan
  const handleGpsLocate = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error('GPS tidak didukung browser ini');
      return;
    }
    
    toast.loading('Mencari lokasi akurat...', { id: 'gps-locating', duration: 20000 });
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        
        // Auto-detect kecamatan from coordinates
        try {
          const kecamatan = await findKecamatanByCoords(lat, lng);
          if (kecamatan) {
            toast.success(`Lokasi ditemukan di Kec. ${kecamatan.nama_kecamatan} (akurasi: ±${Math.round(accuracy)}m)`, { id: 'gps-locating' });
          } else {
            toast.success(`Lokasi ditemukan (akurasi: ±${Math.round(accuracy)}m)`, { id: 'gps-locating' });
          }
        } catch {
          toast.success(`Lokasi ditemukan (akurasi: ±${Math.round(accuracy)}m)`, { id: 'gps-locating' });
        }
        
        setResetFocusTrigger(Date.now());
      },
      (err) => {
        handleLocationError(err);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 } // maximumAge: 0 forces fresh GPS reading
    );
  }, [handleLocationError]);

  const getStatusStyle = (status) => {
    return STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (isAdmin && adminLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-900">
        <AdminSidebar activePath={pathname} />
        <div className="flex-1 ml-64 flex flex-col min-w-0">
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-20">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Peta</h1>
              <p className="text-xs text-slate-500">Peta dan lokasi laporan infrastruktur</p>
            </div>
          </header>
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-sm">Memuat peta...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isAdmin && adminError) {
    return <ErrorState message={adminError} onRetry={() => window.location.reload()} />;
  }

  // Citizen Mobile Map View
  if (!isAdmin) {
    // Filter laporan yang valid memiliki titik koordinat - hanya laporan sendiri
    const displayedReports = reports.filter((r) => r.lat && r.lng);

    const totalCount = displayedReports.length;

    return (
      <div className="h-screen w-full bg-slate-100 max-w-[430px] mx-auto flex flex-col relative overflow-hidden pb-16 font-sans">
        {/* Floating Top Header: Label Laporan Saya + GPS Button */}
        <div className="absolute top-4 left-3 right-3 z-[999] flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center justify-between gap-2 pointer-events-auto">
            {/* Label Laporan Saya - Modern Glassmorphism */}
            <div className="flex-1 flex bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200/80">
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">Laporan Saya</span>
                  <span className="text-[10px] text-slate-400">{totalCount} laporan</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Focus & Layer Settings) */}
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200/80 shrink-0">
              <button
                onClick={handleGpsLocate}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all"
                title="Deteksi Lokasi Saya (GPS)"
              >
                <Navigation className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                  showLayerMenu
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 active:scale-95'
                }`}
                title="Pengaturan Layer & Infrastruktur Jalan"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal / Popup Detail Pengaturan Layer (PERSIS SESUAI SS USER) */}
          {showLayerMenu && (
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 mt-1 z-[1000] animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-180px)] overflow-y-auto pointer-events-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Navigasi Peta & Jalan</h3>
                </div>
                <button
                  onClick={() => setShowLayerMenu(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* TAMPILAN PETA */}
              <div className="mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tampilan Peta</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBaseMap('openstreetmap')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                      baseMap === 'openstreetmap'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Standard Map
                  </button>
                  <button
                    onClick={() => setBaseMap('satellite')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                      baseMap === 'satellite'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Citra Satelit
                  </button>
                </div>
              </div>

              {/* Garis biru membingkai batas resmi Kabupaten Lamongan */}
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 mb-4 flex items-center gap-2.5">
                <span className="w-3.5 h-1.5 bg-blue-600 rounded-sm shrink-0" />
                <p className="text-xs text-blue-800 font-medium leading-tight">
                  Garis biru membingkai batas resmi Kabupaten Lamongan
                </p>
              </div>

              {/* PILIHAN RUAS JALAN */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pilihan Ruas Jalan</p>
                <div className="max-h-64 overflow-y-auto pr-1 space-y-1.5">
                  {Object.entries(ROAD_LAYERS).map(([key, config]) => (
                    <label
                      key={key}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-700">{config.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {layerCounts[key] || config.count}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {layerLoading[key] && (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        )}
                        <input
                          type="checkbox"
                          checked={activeLayers[key]}
                          onChange={() => {
                            toggleLayer(key);
                            fetchLayerCount(key);
                          }}
                          disabled={layerLoading[key]}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Peta Interaktif (CustomMap) dengan Titik Lokasi Laporan & Batas Wilayah Lamongan */}
        <div className="w-full h-full flex-1 relative">
          <CustomMap
            reports={displayedReports}
            activeLayers={activeLayers}
            baseMap={baseMap}
            onResetFocus={resetFocusTrigger}
            onMarkerClick={(report) => setSelectedReportOnMap(report)}
            selectedReport={selectedReportOnMap}
            onLocationFound={handleLocationFound}
            onLocationError={handleLocationError}
            onLayerLoadingChange={handleLayerLoadingChange}
          />
        </div>

        {/* Floating Bottom Card Preview saat Titik Laporan Diklik */}
        {selectedReportOnMap && (
          <div className="absolute bottom-20 left-4 right-4 z-[999] bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 animate-in slide-in-from-bottom-4 duration-200">
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

        {/* Navigasi Utama Aplikasi */}
        <BottomNav />
      </div>
    );
  }

  // Admin View (Modern Clean GovTech GIS)
  return (
    <div className="h-screen bg-[#F8FAFC] flex font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      <AdminSidebar activePath="/admin/gis" />
      
      <div className="flex-1 ml-64 flex flex-col min-w-0 h-screen relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">GIS Map View</h1>
            <p className="text-xs text-slate-500">Visualisasi sebaran ruas jalan & laporan infrastruktur</p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationPopup />

            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200/80">
              <button
                onClick={() => setShowAllReports(!showAllReports)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  showAllReports
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={showAllReports ? 'Tampilkan hanya laporan saya' : 'Tampilkan semua laporan warga'}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{showAllReports ? 'Semua Laporan' : 'Laporan Saya'}</span>
              </button>
            </div>

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

        <main className="flex-1 relative w-full h-[calc(100vh-4rem)]">
          {/* Filter reports based on toggle */}
          <CustomMap
            reports={(isAdminKecamatan || isAdminKabupaten)
              ? (showAllReports ? mapReports : reports).filter(r => r.lat && r.lng && r.status_terkini === 'Diterima')
              : (showAllReports ? mapReports : reports).filter(r => r.lat && r.lng)}
            activeLayers={activeLayers}
            baseMap={viewMode === 'satellite' ? 'satellite' : 'openstreetmap'}
            onResetFocus={resetFocusTrigger}
            onMarkerClick={(report) => setSelectedReportOnMap(report)}
            selectedReport={selectedReportOnMap}
            onLocationFound={handleLocationFound}
            onLocationError={handleLocationError}
            onLayerLoadingChange={handleLayerLoadingChange}
          />
        </main>
      </div>
    </div>
  );
}

export default GISMapViewPage;