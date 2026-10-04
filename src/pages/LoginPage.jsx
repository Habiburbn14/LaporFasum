import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { loginUser } from '../services/authApi';
import toast from 'react-hot-toast';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error('Semua field harus diisi');
      return;
    }

    setLoading(true);
    const result = await loginUser(formData.identifier, formData.identifier, formData.password, false);
    setLoading(false);

    if (result.success) {
      toast.success('Login Berhasil');
      navigate('/');
    } else {
      toast.error(result.error || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex flex-col justify-between p-5 pb-10">
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Masuk ke Sistem</h1>
          <p className="text-sm text-slate-500">Silakan masuk untuk akses fitur pelaporan warga</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              NIK / Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                required
                placeholder="3524... atau email@domain.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                value={formData.identifier}
                onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
              />
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
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer disabled:hover:bg-blue-600"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-slate-500">Belum punya akun?</p>
          <Link to="/register" className="inline-block w-full py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-xl transition">
            Daftar Akun di Sini
          </Link>
          
          <div className="pt-2">
            <Link to="/admin-login" className="text-xs text-slate-500 hover:text-blue-600 hover:underline">
              Masuk sebagai Admin?
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-slate-400">Pemerintah Kabupaten Lamongan</p>
      </div>
    </div>
  );
}

export default LoginPage;
