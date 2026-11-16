import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  KeyRound, 
  MessageCircle, 
  Mail, 
  AlertCircle, 
  X, 
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Check
} from 'lucide-react';
import { loginUser, verifyResetAccount, resetPassword } from '../services/authApi';
import { useAuthStore, roleOf, homePathForRole } from '../stores/useAuthStore';
import toast from 'react-hot-toast';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State Modal Lupa Sandi (Metode 1: Verifikasi NIK + Email)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Verifikasi, 2 = Sandi Baru
  const [forgotNik, setForgotNik] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);

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

  // Reset modal state
  const resetForgotState = () => {
    setForgotStep(1);
    setForgotNik('');
    setForgotEmail('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setShowForgotNewPassword(false);
    setShowForgotConfirmPassword(false);
    setLoadingVerify(false);
    setLoadingReset(false);
    setVerifiedUser(null);
  };

  const handleOpenForgotModal = () => {
    resetForgotState();
    // Jika di form login sudah ada NIK / Email yang diketik, otomatis isi
    const id = formData.identifier.trim();
    if (/^\d{16}$/.test(id)) {
      setForgotNik(id);
    } else if (id.includes('@')) {
      setForgotEmail(id);
    }
    setShowForgotModal(true);
  };

  // Step 1: Verifikasi NIK + Email ke Backend
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!forgotNik || forgotNik.length !== 16) {
      toast.error('NIK harus 16 digit angka');
      return;
    }
    if (!forgotEmail || !forgotEmail.includes('@')) {
      toast.error('Masukkan alamat email yang valid');
      return;
    }

    setLoadingVerify(true);
    const result = await verifyResetAccount(forgotNik.trim(), forgotEmail.trim());
    setLoadingVerify(false);

    if (result.success) {
      setVerifiedUser(result.data);
      setForgotStep(2);
      toast.success('Identitas terverifikasi!');
    } else {
      toast.error(result.error || 'Kombinasi NIK dan Email tidak cocok');
    }
  };

  // Step 2: Simpan Kata Sandi Baru ke Backend
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotNewPassword || forgotNewPassword.length < 8) {
      toast.error('Kata sandi baru minimal 8 karakter');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok');
      return;
    }

    setLoadingReset(true);
    const result = await resetPassword(forgotNik.trim(), forgotEmail.trim(), forgotNewPassword);
    setLoadingReset(false);

    if (result.success) {
      toast.success('Kata sandi berhasil diperbarui! Silakan masuk.');
      // Auto-fill identifier di form login
      setFormData(prev => ({
        ...prev,
        identifier: forgotEmail.trim(),
        password: ''
      }));
      setShowForgotModal(false);
      resetForgotState();
    } else {
      toast.error(result.error || 'Gagal mereset kata sandi');
    }
  };

  const openWhatsAppHelpdesk = () => {
    const text = encodeURIComponent(
      `Halo Admin LaporFasum Lamongan, saya membutuhkan bantuan pemulihan kata sandi akun.\n\nIdentitas Akun:\nNIK: ${forgotNik || '(Belum diisi)'}\nEmail: ${forgotEmail || '(Belum diisi)'}`
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
                onClick={handleOpenForgotModal}
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
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

      {/* Modal Lupa Sandi Interaktif (Metode 1: NIK + Email) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative border border-slate-100">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-3 mx-auto shadow-2xs">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              Pemulihan Kata Sandi
            </h3>

            {/* Stepper Header */}
            <div className="flex items-center justify-center gap-2 mb-4 text-[11px] font-bold text-slate-400">
              <span className={`px-2 py-0.5 rounded-full ${forgotStep === 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                1. Verifikasi Data
              </span>
              <span>&rarr;</span>
              <span className={`px-2 py-0.5 rounded-full ${forgotStep === 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                2. Sandi Baru
              </span>
            </div>

            {/* STEP 1: Verifikasi NIK + Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleVerifySubmit} className="space-y-3.5">
                <p className="text-xs text-slate-500 text-center mb-3 leading-relaxed">
                  Masukkan NIK dan Email yang terdaftar pada akun Anda untuk verifikasi identitas kependudukan.
                </p>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      NIK (16 Digit)
                    </label>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      forgotNik.length === 16 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {forgotNik.length}/16
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      inputMode="numeric"
                      placeholder="Contoh: 3524xxxxxxxxxxxx"
                      value={forgotNik}
                      onChange={(e) => setForgotNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition tracking-wider"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Terdaftar
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingVerify || forgotNik.length !== 16 || !forgotEmail}
                  className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingVerify ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <span>Verifikasi Identitas</span>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Input Sandi Baru */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                {/* Chip info user terverifikasi */}
                <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2.5 text-left">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-emerald-800 truncate">
                      Akun Terverifikasi
                    </p>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {verifiedUser?.nama_lengkap || 'Warga Lamongan'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimal 8 karakter"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showForgotConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Ulangi kata sandi baru"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showForgotConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {forgotConfirmPassword && forgotNewPassword !== forgotConfirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">
                      Konfirmasi kata sandi belum cocok
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    disabled={loadingReset}
                    className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ubah</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loadingReset || forgotNewPassword.length < 8 || forgotNewPassword !== forgotConfirmPassword}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingReset ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan Sandi Baru</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Bantuan Helpdesk Alternatif */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-center space-y-2">
              <p className="text-[11px] text-slate-400">
                Lupa NIK atau email terdaftar Anda?
              </p>
              <button
                type="button"
                onClick={openWhatsAppHelpdesk}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 mx-auto hover:underline cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Bantuan Helpdesk via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
