import React, { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut,
  Bell, Layers, X, ChevronDown
} from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { INITIAL_REPORTS } from '../utils/mockData';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { GeoJSONLayer, GEOJSON_LAYERS } from '../components/GeoJSONLayer';
import BottomNav from '../components/mobile/BottomNav';

function GISMapViewPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const [reports] = useState([...INITIAL_REPORTS, ...INITIAL_REPORTS.slice(0, 4)]);
  const [viewMode, setViewMode] = useState('default');
  const [visibleLayers, setVisibleLayers] = useState(
    Object.keys(GEOJSON_LAYERS).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [showLayerControl, setShowLayerControl] = useState(false);

  const center = [-6.8938, 112.2140];
  const zoom = 11;

  const toggleLayer = (key) => {
    setVisibleLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex flex-col relative overflow-hidden pb-16">
        {/* Map Container */}
        <div className="absolute inset-0 pb-16">
          <MapContainer 
            center={center} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            {viewMode === 'satellite' ? (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            ) : (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
            )}
            
            {Object.keys(GEOJSON_LAYERS).map(key => (
              <GeoJSONLayer key={key} layerKey={key} isVisible={visibleLayers[key]} />
            ))}
            
            <ZoomControl position="topleft" />
          </MapContainer>

          {/* Layer Control Button - Top Right */}
          <button
            onClick={() => setShowLayerControl(!showLayerControl)}
            className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-md px-3 py-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors border border-slate-100"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Layer Dasar
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLayerControl ? 'rotate-180' : ''}`} />
          </button>

          {/* Layer Control Panel - Popup */}
          {showLayerControl && (
            <div className="absolute top-14 right-4 z-[1000] bg-white rounded-xl shadow-lg border border-slate-200 w-56 max-h-[50vh] overflow-y-auto">
              <div className="p-2 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-bold text-slate-900 text-[11px]">Layer & Jalan</h3>
                <button
                  onClick={() => setShowLayerControl(false)}
                  className="w-4 h-4 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="p-2 space-y-2 text-[10px]">
                <div>
                  <p className="font-bold text-slate-600 mb-1 text-[10px]">Peta</p>
                  <div className="space-y-0.5">
                    <label className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="basemap"
                        checked={viewMode === 'default'}
                        onChange={() => setViewMode('default')}
                        className="w-3 h-3 text-blue-600"
                      />
                      <span className="text-slate-700 text-[10px]">OSM</span>
                    </label>
                    <label className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="radio"
                        name="basemap"
                        checked={viewMode === 'satellite'}
                        onChange={() => setViewMode('satellite')}
                        className="w-3 h-3 text-blue-600"
                      />
                      <span className="text-slate-700 text-[10px]">Satelit</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2">
                  <p className="font-bold text-slate-600 mb-1 text-[10px]">Jalan</p>
                  <div className="space-y-0.5">
                    {Object.entries(GEOJSON_LAYERS).map(([key, layer]) => (
                      <label
                        key={key}
                        className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={visibleLayers[key]}
                          onChange={() => toggleLayer(key)}
                          className="w-3 h-3 text-blue-600 rounded"
                        />
                        <span 
                          className="w-2 h-2 rounded-sm flex-shrink-0" 
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-slate-700 flex-1 text-[9px] line-clamp-1">{layer.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // Admin View
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
          >
            {viewMode === 'satellite' ? (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            ) : (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
            )}
            
            {Object.keys(GEOJSON_LAYERS).map(key => (
              <GeoJSONLayer key={key} layerKey={key} isVisible={visibleLayers[key]} />
            ))}
            
            <ZoomControl position="topleft" />
          </MapContainer>

          {/* Layer Control Button - Top Right */}
          <button
            onClick={() => setShowLayerControl(!showLayerControl)}
            className="absolute top-6 right-6 z-[1000] bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Layer Dasar
            <ChevronDown className={`w-4 h-4 transition-transform ${showLayerControl ? 'rotate-180' : ''}`} />
          </button>

          {/* Layer Control Panel - Popup */}
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
                  <p className="text-xs font-bold text-slate-600 mb-3">Fungsi Jalan</p>
                  <div className="space-y-1.5">
                    {Object.entries(GEOJSON_LAYERS).map(([key, layer]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={visibleLayers[key]}
                          onChange={() => toggleLayer(key)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span 
                          className="w-3 h-3 rounded-sm flex-shrink-0" 
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-xs text-slate-700 flex-1">{layer.name}</span>
                      </label>
                    ))}
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
