import React, { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut,
  Bell, User, Shield, Globe, Info, HelpCircle, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

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
          <button onClick={() => navigate('/admin/gis')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
            <Map className="w-5 h-5" />
            GIS Map View
          </button>
          <button onClick={() => navigate('/admin/analytics')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm">
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
              <h1 className="text-xl font-bold text-slate-900">Settings</h1>
              <p className="text-xs text-slate-500">Kelola preferensi dan konfigurasi akun</p>
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
        <main className="p-8 max-w-[1000px] w-full mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-8">
            {['profile', 'account', 'notifications', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab 
                    ? 'text-blue-600' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Profil Admin</h2>
                
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                    AK
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">Admin Kabupaten</h3>
                    <p className="text-sm text-slate-500 mb-2">Dinas PUPR Lamongan</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-600">admin@lamongan.go.id</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">0812-3456-7890</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                    Edit Profil
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Nama Lengkap</label>
                      <input 
                        type="text" 
                        defaultValue="Admin Kabupaten"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Email</label>
                      <input 
                        type="email" 
                        defaultValue="admin@lamongan.go.id"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Nomor Telepon</label>
                      <input 
                        type="tel" 
                        defaultValue="081234567890"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Unit Kerja</label>
                      <input 
                        type="text" 
                        defaultValue="Dinas PUPR Lamongan"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 flex justify-end gap-3">
                <button className="px-4 py-2 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors">
                  Batal
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Akun & Keamanan</h2>
                
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-6">
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Ubah Password</label>
                    <div className="space-y-3">
                      <input 
                        type="password" 
                        placeholder="Password saat ini"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input 
                        type="password" 
                        placeholder="Password baru"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input 
                        type="password" 
                        placeholder="Konfirmasi password baru"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 flex justify-end gap-3">
                <button className="px-4 py-2 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors">
                  Batal
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Notifikasi</h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'email', title: 'Email Notifications', desc: 'Terima laporan baru dan update via email', checked: true },
                    { id: 'sms', title: 'SMS Notifications', desc: 'Dapatkan notifikasi penting via SMS', checked: false },
                    { id: 'push', title: 'Push Notifications', desc: 'Notifikasi real-time di device', checked: true },
                    { id: 'daily', title: 'Daily Digest', desc: 'Ringkasan harian laporan', checked: true },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Tentang Aplikasi</h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">LaporFasum Lamongan</h3>
                    <p className="text-blue-50 text-sm leading-relaxed">
                      Sistem pelaporan fasilitas umum untuk Kabupaten Lamongan yang memudahkan 
                      warga melapor dan pemerintah memproses aduan secara cepat dan transparan.
                    </p>
                    <p className="text-xs text-blue-100 mt-4 opacity-75">
                      Versi 1.0.0 • Terakhir diupdate: 6 Oktober 2026
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">1.248</div>
                      <div className="text-xs text-slate-500">Total Laporan</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">96%</div>
                      <div className="text-xs text-slate-500">Tingkat Resolusi</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                      <div className="text-xs text-slate-500">Kecamatan</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-amber-600 mb-1">12</div>
                      <div className="text-xs text-slate-500">Kategori</div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <h4 className="font-semibold text-slate-900">Informasi Kontak</h4>
                    <div className="space-y-3 text-sm text-slate-600">
                      <p className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-slate-400" />
                        Email: lapor@lamongan.go.id
                      </p>
                      <p className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        Hotline: 0812-3456-7890
                      </p>
                      <p className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        Website: lapor.lamongon.go.id
                      </p>
                    </div>
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

export default SettingsPage;
