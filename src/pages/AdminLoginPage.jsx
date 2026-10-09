import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { loginUser } from '../services/authApi';
import toast from 'react-hot-toast';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginUser(formData.username, formData.username, formData.password, true);
    setLoading(false);

    if (result.success) {
      toast.success('Login Admin Berhasil');
      navigate('/admin/master');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 mt-2">Selamat datang, silakan masuk ke sistem</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 space-y-6 border border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User className="w-5 h-5" /></span>
              <input
                type="text"
                required
                placeholder="Masukkan username"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-5 h-5" /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-0 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all">
            {loading ? 'Memproses...' : 'Masuk Admin'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 LaporFasum Lamongan
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
