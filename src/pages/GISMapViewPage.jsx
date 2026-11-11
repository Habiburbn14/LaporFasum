import React, { useState, useEffect } from 'react';
import { 
  Layers, X, ChevronDown, Crosshair, Route, Globe, User, AlertCircle, MapPin, Eye
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/mobile/BottomNav';
import CustomMap from '../components/CustomMap';
import { useReportStore } from '../stores/useReportStore';
import { useAuthStore } from '../stores/useAuthStore';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorState from '../components/ui/ErrorState';
import { getErrorMessage } from '../utils/error';
import AdminSidebar from '../components/AdminSidebar';
import NotificationPopup from '../components/ui/NotificationPopup';
import LogoutConfirm from '../components/ui/LogoutConfirm';

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
  const { user, logout } = useAuthStore();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => setLogoutOpen(true);
  const confirmLogout = () => {
    logout();
    navigate('/login');
    setLogoutOpen(false);
  };

  // Admin state
  const [viewMode, setViewMode] = useState('default');
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [lamonganData, setLamonganData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);

  // Citizen map states
  const [reportFilter, setReportFilter] = useState('all'); // 'all' | 'mine'
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [baseMap, setBaseMap] = useState('openstreetmap');
  const [resetFocusTrigger, setResetFocusTrigger] = useState(0);
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

  // Boundary style - Garis batas wilayah merah tegas
  const boundaryStyle = {
    color: '#EF4444',
    weight: 3,
    opacity: 1,
    fillColor: '#EF4444',
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

  // Load laporan warga untuk titik lokasi di peta
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
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
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
    // Filter laporan yang valid memiliki titik koordinat
    const displayedReports = reportFilter === 'mine'
      ? reports.filter((r) => r.lat && r.lng)
      : (mapReports.length > 0 ? mapReports : reports.filter((r) => r.lat && r.lng));

    const totalCount = displayedReports.length;

    return (
      <div className="h-screen w-full bg-slate-100 max-w-[430px] mx-auto flex flex-col relative overflow-hidden pb-16 font-sans">
        {/* Floating Top Header: Filter Modern + Tombol Aksi Persis Sesuai SS User */}
        <div className="absolute top-4 left-3 right-3 z-[999] flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center justify-between gap-2 pointer-events-auto">
            {/* Pemfilteran Semua Laporan vs Laporan Saya - Modern Glassmorphism */}
            <div className="flex-1 flex bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200/80">
              <button
                onClick={() => {
                  setReportFilter('all');
                  fetchAllReports();
                }}
                className={`flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  reportFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Semua</span>
                {reportFilter === 'all' && totalCount > 0 && (
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                    {totalCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setReportFilter('mine');
                  fetchReports();
                }}
                className={`flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  reportFilter === 'mine'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Laporan Saya</span>
                {reportFilter === 'mine' && totalCount > 0 && (
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Actions (Focus & Layer Settings) - Tetap persis seperti SS user */}
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200/80 shrink-0">
              <button
                onClick={() => setResetFocusTrigger(Date.now())}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all"
                title="Pusatkan Peta ke Lamongan"
              >
                <Crosshair className="w-4 h-4" />
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

              {/* Garis merah membingkai batas resmi Kabupaten Lamongan */}
              <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200/80 mb-4 flex items-center gap-2.5">
                <span className="w-3.5 h-1.5 bg-red-500 rounded-sm shrink-0" />
                <p className="text-xs text-red-800 font-medium leading-tight">
                  Garis merah membingkai batas resmi Kabupaten Lamongan
                </p>
              </div>

              {/* PILIHAN RUAS JALAN (SCALA) */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pilihan Ruas Jalan (SCALA)</p>
                <div className="space-y-1.5 pr-1">
                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700">Jalan Arteri Primer</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeLayers.arteriPrimer}
                      onChange={() => toggleLayer('arteriPrimer')}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700">Jalan Kolektor Primer</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeLayers.kolektorPrimer1 || activeLayers.kolektorPrimer2 || activeLayers.kolektorPrimer3}
                      onChange={() => {
                        const val = !(activeLayers.kolektorPrimer1 || activeLayers.kolektorPrimer2 || activeLayers.kolektorPrimer3);
                        setActiveLayers((prev) => ({
                          ...prev,
                          kolektorPrimer1: val,
                          kolektorPrimer2: val,
                          kolektorPrimer3: val,
                        }));
                      }}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700">Jalan Sekunder</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeLayers.arteriSecondary || activeLayers.kolektorSecondary}
                      onChange={() => {
                        const val = !(activeLayers.arteriSecondary || activeLayers.kolektorSecondary);
                        setActiveLayers((prev) => ({
                          ...prev,
                          arteriSecondary: val,
                          kolektorSecondary: val,
                        }));
                      }}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700">Jalan Lingkungan</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeLayers.lingkunganPrimary || activeLayers.lingkunganSecondary}
                      onChange={() => {
                        const val = !(activeLayers.lingkunganPrimary || activeLayers.lingkunganSecondary);
                        setActiveLayers((prev) => ({
                          ...prev,
                          lingkunganPrimary: val,
                          lingkunganSecondary: val,
                        }));
                      }}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-slate-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700">Jalan Lokal</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeLayers.lokalPrimary || activeLayers.lokalSecondary}
                      onChange={() => {
                        const val = !(activeLayers.lokalPrimary || activeLayers.lokalSecondary);
                        setActiveLayers((prev) => ({
                          ...prev,
                          lokalPrimary: val,
                          lokalSecondary: val,
                        }));
                      }}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
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
      <AdminSidebar activePath="/admin/gis" onLogout={handleLogout} />
      <LogoutConfirm 
        isOpen={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onConfirm={confirmLogout} 
      />
      
      <div className="flex-1 ml-64 flex flex-col min-w-0 h-screen relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">GIS Map View</h1>
            <p className="text-xs text-slate-500">Visualisasi sebaran ruas jalan</p>
          </div>

          <div className="flex items-center gap-3">
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

        <main className="flex-1 relative w-full h-[calc(100vh-4rem)]">
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
                filter={(feature) => feature.geometry?.type !== 'Point'}
                style={boundaryStyle}
              />
            )}
            
            <ZoomControl position="topleft" />
          </MapContainer>

          {/* Floating Floating Layer Toolbar */}
          <div className="absolute top-5 right-6 z-[1000] flex flex-col items-end gap-2 pointer-events-none">
            <button
              onClick={() => setShowLayerControl(!showLayerControl)}
              className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/90 px-3.5 py-2 flex items-center gap-2 text-xs font-semibold text-slate-800 hover:bg-white hover:border-slate-300 transition-all active:scale-95"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Lapisan Peta</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showLayerControl ? 'rotate-180' : ''}`} />
            </button>

            {showLayerControl && (
              <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 w-72 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-xs">Pilihan Lapisan GIS</h3>
                  </div>
                  <button
                    onClick={() => setShowLayerControl(false)}
                    className="w-6 h-6 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 space-y-3.5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Tipe Peta Dasar</p>
                    <div className="space-y-1.5">
                      <label className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        viewMode === 'default' 
                          ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-semibold' 
                          : 'bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50'
                      }`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="basemap"
                            checked={viewMode === 'default'}
                            onChange={() => setViewMode('default')}
                            className="w-3.5 h-3.5 text-blue-600"
                          />
                          <span>OpenStreetMap (Vektor)</span>
                        </div>
                      </label>
                      <label className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        viewMode === 'satellite' 
                          ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-semibold' 
                          : 'bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50'
                      }`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="basemap"
                            checked={viewMode === 'satellite'}
                            onChange={() => setViewMode('satellite')}
                            className="w-3.5 h-3.5 text-blue-600"
                          />
                          <span>Satelit (World Imagery)</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Batas Administrasi</p>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 bg-red-600 rounded-full" />
                        <span className="text-xs font-medium text-slate-800">Deliniasi Kab. Lamongan</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        GeoJSON Aktif
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Spatial Info Card (Bottom Left) */}
          <div className="absolute bottom-5 left-6 z-[1000] pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="font-semibold text-slate-900 leading-tight">Peta Wilayah Lamongan</p>
                <p className="text-[11px] text-slate-500">27 Kecamatan Terpantau</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default GISMapViewPage;
