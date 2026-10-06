import React, { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut,
  Search, Bell, Filter, Layers, Navigation, ZoomIn, ZoomOut
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { INITIAL_REPORTS } from '../utils/mockData';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

function GISMapViewPage() {
  const navigate = useNavigate();
  const [reports] = useState([...INITIAL_REPORTS, ...INITIAL_REPORTS.slice(0, 4)]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('default');

  const center = [-6.8938, 112.2140];
  const zoom = 11;

  const filteredReports = reports.filter(r => {
    const matchCategory = selectedCategory === '' || r.kategori === selectedCategory;
    const matchStatus = selectedStatus === '' || r.status === selectedStatus;
    return matchCategory && matchStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Menunggu Verifikasi': return '#f59e0b';
      case 'Diterima': return '#3b82f6';
      case 'Selesai': return '#10b981';
      default: return '#64748b';
    }
  };

  const categories = [...new Set(reports.map(r => r.kategori))];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">GIS Map View</h1>
              <p className="text-xs text-slate-500">Visualisasi sebaran laporan kerusakan fasilitas umum</p>
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

        {/* Content */}
        <main className="p-8 space-y-6 max-w-[1800px] w-full mx-auto">
          {/* Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Filter:</span>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Diterima">Diterima</option>
                <option value="Selesai">Selesai</option>
              </select>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Tampilan:</span>
                <div className="flex bg-slate-100 rounded-full p-1">
                  <button 
                    onClick={() => setViewMode('default')}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${viewMode === 'default' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Default
                  </button>
                  <button 
                    onClick={() => setViewMode('satellite')}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all ${viewMode === 'satellite' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Satellite
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-slate-600">Menunggu Verifikasi</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-600">Diterima</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">Selesai</span>
              </div>
              <div className="ml-auto text-xs text-slate-500">
                {filteredReports.length} titik ditemukan
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[70vh] min-h-[600px]">
            <MapContainer 
              center={center} 
              zoom={zoom} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              {viewMode === 'satellite' ? (
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                />
              ) : (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              )}
              
              {filteredReports.map((r, i) => (
                <Marker key={i} position={[r.latitude, r.longitude]}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-blue-600">{r.ticket_code}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          r.status === 'Menunggu Verifikasi' ? 'bg-amber-50 text-amber-700' :
                          r.status === 'Diterima' ? 'bg-blue-50 text-blue-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 mb-1">{r.judul}</p>
                      <p className="text-xs text-slate-500 mb-2">{r.kategori} - {r.kecamatan}</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{r.deskripsi}</p>
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-400">Pelapor: {r.pelapor}</p>
                        <p className="text-xs text-slate-400">{new Date(r.tanggal).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              <ZoomControl position="bottomright" />
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Statistik Sebaran
              </h3>
              <div className="space-y-4">
                {['Menunggu Verifikasi', 'Diterima', 'Selesai'].map(status => {
                  const count = filteredReports.filter(r => r.status === status).length;
                  const percentage = filteredReports.length > 0 ? (count / filteredReports.length * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(status) }}></div>
                        <span className="text-sm text-slate-700">{status}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{count} laporan</p>
                        <p className="text-xs text-slate-400">{percentage}% dari total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Keterangan
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                  <span><strong>Kuning</strong> - Laporan belum diverifikasi oleh petugas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                  <span><strong>Biru</strong> - Laporan diterima dan sedang diproses</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                  <span><strong>Hijau</strong> - Laporan sudah selesai diperbaiki</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default GISMapViewPage;
