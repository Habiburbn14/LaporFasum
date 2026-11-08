import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Loader2, 
  AlertCircle,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { registerUser } from '../services/authApi';
import { KECAMATAN_LIST } from '../utils/kecamatan';
import toast from 'react-hot-toast';

function RegisterPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1); // 1 = Identitas & Wilayah, 2 = Keamanan & Akun
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    id_kecamatan: '',
    alamat_domisili: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kecamatanOpen, setKecamatanOpen] = useState(false);
  const [kecamatanSearch, setKecamatanSearch] = useState('');
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);

  // Filter daftar kecamatan Lamongan
  const filteredKecamatan = KECAMATAN_LIST.filter(k => 
    k.nama_kecamatan.toLowerCase().includes(kecamatanSearch.toLowerCase())
  );

  const selectedKecamatanObj = KECAMATAN_LIST.find(
    k => k.id_kecamatan === parseInt(formData.id_kecamatan)
  );

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setKecamatanOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nik') {
      // Hanya izinkan angka untuk NIK
      const numbersOnly = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, nik: numbersOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validasi Fase 1 (Data Diri & Wilayah)
  const validatePhase1 = () => {
    const newErrors = {};

    if (!formData.nama.trim() || formData.nama.trim().length < 3) {
      newErrors.nama = 'Nama lengkap minimal 3 karakter';
    }

    if (!formData.nik || formData.nik.length !== 16) {
      newErrors.nik = 'NIK harus tepat 16 digit angka';
    }

    if (!formData.id_kecamatan) {
      newErrors.id_kecamatan = 'Silakan pilih kecamatan tempat domisili';
    }

    if (!formData.alamat_domisili.trim() || formData.alamat_domisili.trim().length < 5) {
      newErrors.alamat_domisili = 'Alamat domisili minimal 5 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextPhase = (e) => {
    e.preventDefault();
    if (!validatePhase1()) {
      toast.error('Mohon lengkapi data diri dengan benar');
      return;
    }
    setPhase(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPhase = () => {
    setPhase(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validasi Fase 2 & Submit
  const validatePhase2 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Kata sandi minimal 8 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok';
    }

    if (!termsAccepted) {
      newErrors.terms = 'Anda harus menyetujui syarat & ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhase2()) {
      toast.error('Periksa kembali data akun & persetujuan');
      return;
    }

    setLoading(true);
    const result = await registerUser(
      formData.nama.trim(),
      formData.nik.trim(),
      formData.email.trim(),
      formData.password,
      formData.alamat_domisili.trim(),
      parseInt(formData.id_kecamatan)
    );
    setLoading(false);

    if (result.success) {
      toast.success('Pendaftaran Berhasil! Silakan masuk.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex flex-col justify-between p-5 pb-8 font-sans">
      <div>
        {/* Header Logo */}
        <div className="flex items-center justify-center mt-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-500/20">
              L
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">LaporFasum</span>
              <p className="text-[10px] text-blue-600 font-semibold tracking-wider uppercase">Pemerintah Kab. Lamongan</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Akun Baru</h1>
          <p className="text-xs text-slate-500 mt-1">
            {phase === 1 
              ? 'Langkah 1: Masukkan data identitas kependudukan Anda'
              : 'Langkah 2: Lengkapi email dan kata sandi keamanan akun'}
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs mb-5">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={phase === 1 ? 'text-blue-600' : 'text-slate-400'}>
              1. Identitas & Domisili
            </span>
            <span className={phase === 2 ? 'text-blue-600' : 'text-slate-400'}>
              2. Akun & Sandi
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: phase === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* FASE 1: IDENTITAS & WILAYAH */}
        {phase === 1 && (
          <form onSubmit={handleNextPhase} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Nama Lengkap (Sesuai e-KTP)
              </label>
              <input
                type="text"
                name="nama"
                required
                placeholder="Contoh: Budi Santoso"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.nama}
                onChange={handleChange}
              />
              {errors.nama && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.nama}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Nomor Induk Kependudukan (NIK)
                </label>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  formData.nik.length === 16 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {formData.nik.length}/16 Digit
                </span>
              </div>
              <input
                type="text"
                name="nik"
                required
                maxLength={16}
                inputMode="numeric"
                placeholder="Masukkan 16 digit NIK e-KTP"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition tracking-wider"
                value={formData.nik}
                onChange={handleChange}
              />
              {errors.nik ? (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.nik}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  NIK digunakan untuk validasi resmi aduan fasilitas di Lamongan
                </p>
              )}
            </div>

            {/* Dropdown Kecamatan */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Kecamatan Domisili
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setKecamatanOpen(!kecamatanOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition text-left cursor-pointer"
                >
                  <span className={`flex items-center gap-2 truncate ${formData.id_kecamatan ? 'text-slate-800' : 'text-slate-400'}`}>
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    {selectedKecamatanObj ? `Kecamatan ${selectedKecamatanObj.nama_kecamatan}` : 'Pilih Kecamatan di Lamongan'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${kecamatanOpen ? 'rotate-180' : ''}`} />
                </button>

                {kecamatanOpen && (
                  <div className="absolute z-20 w-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Cari nama kecamatan..."
                          className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                          value={kecamatanSearch}
                          onChange={(e) => setKecamatanSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                      {filteredKecamatan.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-xs">Kecamatan tidak ditemukan</div>
                      ) : (
                        filteredKecamatan.map((kec) => (
                          <button
                            key={kec.id_kecamatan}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, id_kecamatan: String(kec.id_kecamatan) }));
                              setKecamatanOpen(false);
                              setKecamatanSearch('');
                              if (errors.id_kecamatan) setErrors(prev => ({ ...prev, id_kecamatan: '' }));
                            }}
                            className={`w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-blue-50/70 transition-colors flex items-center justify-between ${
                              formData.id_kecamatan === String(kec.id_kecamatan) ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'
                            }`}
                          >
                            <span>Kecamatan {kec.nama_kecamatan}</span>
                            {formData.id_kecamatan === String(kec.id_kecamatan) && (
                              <Check className="w-3.5 h-3.5 text-blue-600" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {errors.id_kecamatan && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.id_kecamatan}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Alamat Lengkap Domisili
              </label>
              <textarea
                name="alamat_domisili"
                required
                rows={3}
                placeholder="Contoh: Dusun Plosorejo RT 01 / RW 02, Desa Solokuro"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none leading-relaxed"
                value={formData.alamat_domisili}
                onChange={handleChange}
              />
              {errors.alamat_domisili && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.alamat_domisili}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjutkan ke Keamanan Akun</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </form>
        )}

        {/* FASE 2: AKUN & KEAMANAN */}
        {phase === 2 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4 animate-in fade-in duration-200">
            {/* Ringkasan Identitas dari Fase 1 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Pendaftar</p>
                <p className="text-sm font-bold text-slate-900 truncate">{formData.nama}</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  NIK: <span className="font-mono">{formData.nik}</span> • {selectedKecamatanObj ? `Kec. ${selectedKecamatanObj.nama_kecamatan}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrevPhase}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold underline px-2 py-1"
              >
                Ubah
              </button>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Alamat Email Aktif
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="nama@email.com"
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-3.5 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Ulangi kata sandi"
                  className="w-full pl-3.5 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Checkbox Persetujuan Syarat */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  Saya menyatakan data diri di atas adalah sah dan menyetujui Ketentuan Layanan LaporFasum Lamongan.
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {errors.terms}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrevPhase}
                disabled={loading}
                className="w-1/3 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="submit"
                disabled={loading || !termsAccepted}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Daftar Akun</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Link Kembali ke Login */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-6">
        <p className="text-[11px] text-slate-400">
          Pemerintah Kabupaten Lamongan &copy; 2026
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
