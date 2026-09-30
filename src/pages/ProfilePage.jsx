import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, UserCircle, Lock, HelpCircle, MessageSquare, FileText, ShieldCheck, LogOut, BadgeCheck } from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import MenuItem from '../components/profile/MenuItem';
import EditProfileModal from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';
import AvatarUploadModal from '../components/profile/AvatarUploadModal';
import HelpModal from '../components/profile/HelpModal';
import FeedbackModal from '../components/profile/FeedbackModal';
import PolicyModal from '../components/profile/PolicyModal';
import { getUserProfile, logoutUser } from '../services/userApi';
import { INITIAL_REPORTS } from '../utils/mockData';
import toast from 'react-hot-toast';

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyType, setPolicyType] = useState('privacy');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await getUserProfile();
      if (result.success) {
        setProfile(result.data);
      } else {
        toast.error('Gagal memuat profil');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const userReports = INITIAL_REPORTS;
  const stats = {
    totalLaporan: userReports.length,
    selesai: userReports.filter(r => r.status === 'Selesai').length
  };

  const handleLogout = async () => {
    if (window.confirm('Yakin ingin keluar?')) {
      await logoutUser();
      toast.success('Berhasil keluar');
      navigate('/login');
    }
  };

  const handlePolicyClick = (type) => {
    setPolicyType(type);
    setShowPolicyModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-200 animate-pulse mx-auto mb-4"></div>
          <p className="text-slate-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28">
      <header className="bg-white px-5 pt-8 pb-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola data dan pengaturan akun Anda</p>
      </header>

      {profile && (
        <>
          <div className="px-5 mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.nama}
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-md"
                  />
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center shadow-md hover:bg-emerald-700 transition"
                  >
                    <Pencil className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-slate-900">{profile.nama}</h2>
                    {profile.isVerified && (
                      <BadgeCheck className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-3">Akun Terverifikasi</p>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600"><span className="font-medium">NIK:</span> {profile.nik}</p>
                    <p className="text-xs text-slate-600"><span className="font-medium">Email:</span> {profile.email}</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <p className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.lokasi}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{stats.totalLaporan}</p>
                <p className="text-xs text-slate-600 mt-1">Total Aduan</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.selesai}</p>
                <p className="text-xs text-slate-600 mt-1">Tuntas Diperbaiki</p>
              </div>
            </div>
          </div>

          <div className="px-5 mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Pengaturan Akun</p>
              </div>
              <MenuItem
                icon={UserCircle}
                title="Edit Profil & Domisili"
                subtitle="Ubah informasi pribadi Anda"
                onClick={() => setShowEditModal(true)}
              />
              <div className="border-t border-slate-100"></div>
              <MenuItem
                icon={Lock}
                title="Keamanan & Kata Sandi"
                subtitle="Ubah password akun"
                onClick={() => setShowPasswordModal(true)}
              />
            </div>
          </div>

          <div className="px-5 mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Informasi & Dukungan</p>
              </div>
              <MenuItem
                icon={HelpCircle}
                title="Pusat Bantuan"
                subtitle="FAQ dan panduan penggunaan"
                onClick={() => setShowHelpModal(true)}
              />
              <div className="border-t border-slate-100"></div>
              <MenuItem
                icon={FileText}
                title="Kebijakan Privasi Data"
                subtitle="Pelajari kebijakan kami"
                onClick={() => handlePolicyClick('privacy')}
              />
              <div className="border-t border-slate-100"></div>
              <MenuItem
                icon={ShieldCheck}
                title="Syarat & Ketentuan"
                subtitle="Pelajari syarat layanan"
                onClick={() => handlePolicyClick('terms')}
              />
              <div className="border-t border-slate-100"></div>
              <MenuItem
                icon={MessageSquare}
                title="Beri Feedback"
                subtitle="Berikan saran atau laporan"
                onClick={() => setShowFeedbackModal(true)}
              />
            </div>
          </div>

          <div className="px-5 mt-6 mb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-50 transition"
            >
              <LogOut className="w-5 h-5" />
              Keluar dari Akun
            </button>
          </div>

          <div className="px-5 mb-4 text-center">
            <p className="text-xs text-slate-400">LaporFasum v1.0.0</p>
            <p className="text-xs text-slate-400 mt-0.5">© 2026 Pemerintah Kabupaten Lamongan</p>
          </div>
        </>
      )}

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
