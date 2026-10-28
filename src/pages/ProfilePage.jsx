import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pencil,
  UserCircle,
  Lock,
  HelpCircle,
  MessageSquare,
  FileText,
  ShieldCheck,
  LogOut,
  BadgeCheck,
  MapPin,
  CheckCircle2,
  FileStack
} from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import MenuItem from '../components/profile/MenuItem';
import EditProfileModal from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import AvatarUploadModal from '../components/profile/AvatarUploadModal';
import HelpModal from '../components/profile/HelpModal';
import FeedbackModal from '../components/profile/FeedbackModal';
import PolicyModal from '../components/profile/PolicyModal';
import { getUserProfile } from '../services/userApi';
import { useReportStore } from '../stores/useReportStore';
import toast from 'react-hot-toast';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorState from '../components/ui/ErrorState';
import { logout } from '../services/authApi';

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyType, setPolicyType] = useState('privacy');

  const { reports, fetchReports } = useReportStore();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    const result = await getUserProfile();
    if (result.success) {
      setProfile(result.data);
    } else {
      setError(result.error || 'Gagal memuat profil');
      toast.error('Gagal memuat profil');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    fetchReports();
  }, [fetchReports]);

  // Statistik dihitung langsung dari data laporan pengguna yang riil
  const totalReportsCount = reports.length;
  const completedReportsCount = reports.filter((r) => r.status === 'Selesai').length;

  const handleLogout = async () => {
    if (window.confirm('Yakin ingin keluar?')) {
      logout();
      toast.success('Berhasil keluar');
      navigate('/login');
    }
  };

  const handlePolicyClick = (type) => {
    setPolicyType(type);
    setShowPolicyModal(true);
  };

  if (loading) return <LoadingScreen message="Memuat profil..." />;

  if (error) return <ErrorState message={error} onRetry={fetchProfile} />;

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 font-sans">
      {/* Header Gradien - Senada dengan Beranda & Riwayat */}
      <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-8 pb-16 rounded-b-3xl relative overflow-hidden shadow-sm">
        {/* Aksen Dekorasi Transparan */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-2 left-6 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative">
          <h1 className="text-xl font-bold text-white tracking-tight">Profil Saya</h1>
          <p className="text-xs text-blue-100 mt-1">Kelola data dan pengaturan akun Anda</p>
        </div>
      </header>

      {profile && (
        <>
          {/* Kartu Profil Utama (Floating Overlap Header) */}
          <div className="px-5 -mt-10 relative z-10">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100 items-center">
                <div className="relative shrink-0">
                  <img
                    src={profile.avatar}
                    alt={profile.nama}
                    className="w-18 h-18 rounded-full object-cover border-4 border-white shadow-md bg-slate-100"
                  />
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition"
                    title="Ubah Foto Profil"
                  >
                    <Pencil className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h2 className="text-base font-bold text-slate-900 truncate">{profile.nama}</h2>
                    {profile.isVerified && (
                      <BadgeCheck className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {profile.nik && (
                      <p className="text-xs text-slate-500 font-mono">NIK: {profile.nik}</p>
                    )}
                    <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                  </div>
                </div>
              </div>

              {/* Lokasi Domisili */}
              <div className="text-xs text-slate-600 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{profile.lokasi || 'Kabupaten Lamongan'}</span>
              </div>
            </div>
          </div>

          {/* Kotak Statistik Riil (Konsisten dengan Sistem) */}
          <div className="px-5 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FileStack className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 leading-tight">{totalReportsCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Total Aduan</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 leading-tight">{completedReportsCount}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tuntas Diperbaiki</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aktivitas Pengguna */}
          <div className="px-5 mt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Aktivitas Saya</p>
              </div>
              <MenuItem
                icon={FileText}
                title="Riwayat Laporan Saya"
                subtitle="Lihat dan pantau semua laporan yang Anda kirim"
                onClick={() => navigate('/tracking')}
              />
            </div>
          </div>

          {/* Pengaturan Akun */}
          <div className="px-5 mt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pengaturan Akun</p>
              </div>
              <MenuItem
                icon={UserCircle}
                title="Edit Profil & Domisili"
                subtitle="Perbarui nama, NIK, dan alamat tempat tinggal"
                onClick={() => setShowEditModal(true)}
              />
              <div className="border-t border-slate-100" />
              <MenuItem
                icon={Lock}
                title="Keamanan & Kata Sandi"
                subtitle="Ganti password keamanan akun Anda"
                onClick={() => setShowPasswordModal(true)}
              />
            </div>
          </div>

          {/* Informasi & Dukungan */}
          <div className="px-5 mt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Informasi & Dukungan</p>
              </div>
              <MenuItem
                icon={HelpCircle}
                title="Pusat Bantuan"
                subtitle="Pertanyaan umum (FAQ) dan panduan aplikasi"
                onClick={() => setShowHelpModal(true)}
              />
              <div className="border-t border-slate-100" />
              <MenuItem
                icon={FileText}
                title="Kebijakan Privasi Data"
                subtitle="Perlindungan kerahasiaan data pelapor"
                onClick={() => handlePolicyClick('privacy')}
              />
              <div className="border-t border-slate-100" />
              <MenuItem
                icon={ShieldCheck}
                title="Syarat & Ketentuan"
                subtitle="Ketentuan penggunaan layanan LaporFasum"
                onClick={() => handlePolicyClick('terms')}
              />
              <div className="border-t border-slate-100" />
              <MenuItem
                icon={MessageSquare}
                title="Beri Masukan / Feedback"
                subtitle="Sampaikan kritik dan saran untuk pengembangan sistem"
                onClick={() => setShowFeedbackModal(true)}
              />
            </div>
          </div>

          {/* Tombol Keluar Akun */}
          <div className="px-5 mt-5 mb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 rounded-xl text-red-600 font-semibold text-xs hover:bg-red-50 hover:border-red-300 transition active:scale-[0.99] shadow-xs"
            >
              <LogOut className="w-4.5 h-4.5" />
              Keluar dari Akun
            </button>
          </div>

          {/* Versi & Hak Cipta */}
          <div className="px-5 mb-4 text-center">
            <p className="text-[11px] font-medium text-slate-400">LaporFasum v1.0.0</p>
            <p className="text-[10px] text-slate-400 mt-0.5">© 2026 Pemerintah Kabupaten Lamongan</p>
          </div>
        </>
      )}

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onUpdate={setProfile}
      />
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={profile?.avatar}
        onUpdate={(newAvatar) => setProfile(prev => ({ ...prev, avatar: newAvatar }))}
      />
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
      <PolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        type={policyType}
      />

      <BottomNav />
    </div>
  );
}

export default ProfilePage;
