import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import AdminSidebar from '../components/AdminSidebar';

function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.endsWith('/settings/account')) return 'account';
    if (path.endsWith('/settings/about')) return 'about';
    return 'profile';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTab);

  // Sync activeTab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const paths = {
      profile: '/admin/settings',
      account: '/admin/settings/account',
      about: '/admin/settings/about',
    };
    navigate(paths[tab]);
  };

  return (
    <>
      {/* Admin Sidebar */}
      <AdminSidebar activePath={location.pathname} />

      {/* Main Content - Full Width */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pengaturan</h1>
            <p className="text-xs text-slate-500">Kelola profil dan akun</p>
          </div>
        </header>

        {/* Content - Full Page */}
        <main className="flex-1 p-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            {/* Tab Content */}
            {activeTab === 'profile' && <ProfileTab user={user} />}
            {activeTab === 'account' && <AccountTab />}
            {activeTab === 'about' && <AboutTab />}
          </div>
        </main>
        
      </div>
    </>
  );
}

function ProfileTab({ user }) {
  return (
    <>
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Profil Admin</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {user?.nama_lengkap?.charAt(0) || user?.nama?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">{user?.nama_lengkap || user?.nama || 'Admin Kabupaten'}</h3>
            <p className="text-sm text-slate-500 mt-1">{user?.email || 'admin@lamongan.go.id'}</p>
            <p className="text-sm text-slate-500 mt-0.5">Dinas PUPR Lamongan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                defaultValue={user?.nama_lengkap || 'Admin Kabupaten'}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Email</label>
              <input 
                type="email" 
                defaultValue={user?.email || 'admin@lamongan.go.id'}
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
      <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
        <button className="px-4 py-2 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors">
          Batal
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          Simpan Perubahan
        </button>
      </div>
    </>
  );
}

function AccountTab() {
  return (
    <>
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Akun & Keamanan</h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Ubah Password</h3>
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
      <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
        <button className="px-4 py-2 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors">
          Batal
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
          Update Password
        </button>
      </div>
    </>
  );
}

function AboutTab() {
  return (
    <>
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Tentang Aplikasi</h2>
      </div>
      <div className="p-6 space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-semibold text-slate-900">Informasi Kontak</h4>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="flex items-center gap-3">
              <span className="w-4 h-4 text-slate-400">ℹ️</span>
              Email: lapor@lamongan.go.id
            </p>
            <p className="flex items-center gap-3">
              <span className="w-4 h-4 text-slate-400">📞</span>
              Hotline: 0812-3456-7890
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;