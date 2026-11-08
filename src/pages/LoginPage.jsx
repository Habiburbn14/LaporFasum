import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2, KeyRound, MessageCircle, Mail, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { loginUser } from '../services/authApi';
import { useAuthStore, roleOf, homePathForRole } from '../stores/useAuthStore';
import toast from 'react-hot-toast';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error('NIK/Email dan Password harus diisi');
      return;
    }

    setLoading(true);
    const result = await loginUser(formData.identifier.trim(), formData.password);
    setLoading(false);

    if (result.success) {
      await login(result.token, result.user);

      // Verifikasi role akun (Warga = 1, Admin Kecamatan = 2, Admin Kabupaten = 3)
      let currentUser = useAuthStore.getState().user;
      if (!roleOf(currentUser)) {
        await useAuthStore.getState().fetchUser();
        currentUser = useAuthStore.getState().user;
      }

      const role = roleOf(currentUser);
      if (!role) {
        toast.error('Gagal memuat profil akun');
        useAuthStore.getState().logout();
        return;
      }

      toast.success('Berhasil Masuk!');
      // Pengalihan otomatis berdasarkan role (Admin otomatis ke dashboard admin, Warga ke beranda)
      navigate(homePathForRole(role), { replace: true });
    } else {
      toast.error(result.error || 'NIK/Email atau password salah');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      toast.error('Masukkan NIK atau Email terdaftar');
      return;
    }
    setForgotSubmitted(true);
  };

  const openWhatsAppHelpdesk = () => {
    const text = encodeURIComponent(
      `Halo Admin LaporFasum Lamongan, saya membutuhkan bantuan pemulihan kata sandi akun.\n\nIdentitas Akun:\nNIK / Email: ${forgotIdentifier || '(Belum diisi)'}`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex flex-col justify-between p-5 pb-8 font-sans">
      <div>
        {/* Header Logo */}
        <div className="flex items-center justify-center mt-6 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-500/20">
              L
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">LaporFasum</span>
              <p className="text-[10px] text-blue-600 font-semibold tracking-wider uppercase">Kabupaten Lamongan</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang</h1>
          <p className="text-xs text-slate-500 mt-1">
            Masuk dengan NIK atau Email akun Anda untuk mengakses sistem
          </p>
        </div>

        {/* Form Login Terpadu */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              NIK atau Alamat Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                required
                placeholder="Contoh: 3524... atau nama@email.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.identifier}
                onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotIdentifier(formData.identifier || '');
                  setForgotSubmitted(false);
                  setShowForgotModal(true);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition cursor-pointer"
              >
                Lupa sandi?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan kata sandi"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Masuk ke Akun</span>
            )}
          </button>
        </form>

        {/* Pendaftaran Akun */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-xs text-slate-400 font-medium">Belum memiliki akun LaporFasum?</p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center w-full py-3 px-4 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-blue-600 font-bold text-sm rounded-2xl transition shadow-2xs"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-6">
        <p className="text-[11px] text-slate-400">
          Pemerintah Kabupaten Lamongan &copy; 2026
        </p>
      </div>

      {/* Modal Lupa Sandi */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              Pemulihan Kata Sandi
            </h3>
            <p className="text-xs text-slate-500 text-center mb-5 leading-relaxed">
              Masukkan NIK atau Email yang terdaftar untuk menerima panduan reset kata sandi akun Anda.
            </p>

            {!forgotSubmitted ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    NIK / Email Terdaftar
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan NIK atau email Anda"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/25 transition cursor-pointer"
                >
                  Ajukan Pemulihan
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 text-left">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800">Permintaan Terkirim</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                      Sistem telah mencatat permintaan untuk <strong>{forgotIdentifier}</strong>. Anda dapat langsung mengonfirmasi ke Helpdesk resmi untuk verifikasi cepat:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openWhatsAppHelpdesk}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  <span>Hubungi Helpdesk via WhatsApp</span>
                </button>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
