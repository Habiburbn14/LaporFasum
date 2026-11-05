import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ShieldAlert, Search, ChevronDown, MapPin } from 'lucide-react';
import { registerUser } from '../services/authApi';
import { KECAMATAN_LIST } from '../utils/kecamatan';
import toast from 'react-hot-toast';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    email: '',
    password: '',
    confirmPassword: '',
    alamat_domisili: '',
    id_kecamatan: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNik, setShowNik] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kecamatanOpen, setKecamatanOpen] = useState(false);
  const [kecamatanSearch, setKecamatanSearch] = useState('');
  const dropdownRef = useRef(null);

  // Filter kecamatan based on search
  const filteredKecamatan = KECAMATAN_LIST.filter(k => 
    k.nama_kecamatan.toLowerCase().includes(kecamatanSearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setKecamatanOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.nik || !formData.email || !formData.password || !formData.alamat_domisili || !formData.id_kecamatan) {
      toast.error('Semua field wajib diisi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    if (formData.nik.length < 16) {
      toast.error('NIK harus 16 digit');
      return;
    }

    setLoading(true);
    const result = await registerUser(
      formData.nama, 
      formData.nik, 
      formData.email, 
      formData.password, 
      formData.alamat_domisili, 
      parseInt(formData.id_kecamatan)
    );
    setLoading(false);

    if (result.success) {
      toast.success('Pendaftaran Berhasil!');
      navigate('/login');
    } else {
      toast.error(result.error || 'Pendaftaran gagal');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex flex-col justify-between p-5 pb-10 relative">
      <div>
        <div className="flex items-center justify-center mt-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              L
            </div>
            <span className="font-bold text-slate-900">LaporFasum</span>
          </div>
          <div className="w-9" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Buat Akun Baru</h1>
          <p className="text-sm text-slate-500">Daftarkan diri Anda untuk mengakses sistem</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          {/* Section: Identitas */}
          <div className="pt-1">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Identitas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  NIK (16 Digit)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="3524XXXXXXXXXX"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.nik}
                    onChange={(e) => setFormData(prev => ({ ...prev, nik: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Kontak */}
          <div className="pt-1">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Kontak</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Alamat Domisili
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <MapPin className="w-4.5 h-4.5" />
                  </span>
                  <textarea
                    required
                    rows={3}
                    placeholder="Masukkan alamat lengkap domisili"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition resize-none"
                    value={formData.alamat_domisili}
                    onChange={(e) => setFormData(prev => ({ ...prev, alamat_domisili: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Lokasi */}
          <div className="pt-1">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Lokasi</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Kecamatan
              </label>
              <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setKecamatanOpen(!kecamatanOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition text-left"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-slate-400" />
                  {formData.id_kecamatan 
                    ? KECAMATAN_LIST.find(k => k.id_kecamatan === parseInt(formData.id_kecamatan))?.nama_kecamatan
                    : 'Pilih kecamatan'}
                </span>
                <ChevronDown 
                  className={`w-4.5 h-4.5 text-slate-400 transition-transform ${kecamatanOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {kecamatanOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b border-slate-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari kecamatan..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        value={kecamatanSearch}
                        onChange={(e) => setKecamatanSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredKecamatan.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-sm">Kecamatan tidak ditemukan</div>
                    ) : (
                      filteredKecamatan.map((kec) => (
                        <button
                          key={kec.id_kecamatan}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, id_kecamatan: kec.id_kecamatan }));
                            setKecamatanOpen(false);
                            setKecamatanSearch('');
                          }}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-slate-50 transition-colors ${formData.id_kecamatan === String(kec.id_kecamatan) ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}
                        >
                          {kec.nama_kecamatan}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
            Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimal 8 karakter"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Konfirmasi Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Ulangi password"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600 leading-tight">
                Saya menyetujui <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a> serta <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a> yang berlaku.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-500">
            Sudah punya akun? <Link to="/login" className="text-blue-600 font-medium hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-slate-400">Pemerintah Kabupaten Lamongan</p>
      </div>
    </div>
  );
}

export default RegisterPage;