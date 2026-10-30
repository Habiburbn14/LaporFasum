import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { updateUserProfile } from '../../services/userApi';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  BadgeCheck, 
  Loader2, 
  Check, 
  AlertCircle 
} from 'lucide-react';

function EditProfileModal({ isOpen, onClose, profile, onUpdate }) {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    lokasi: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Selalu sinkronkan data ketika modal dibuka atau profil berubah
  useEffect(() => {
    if (profile) {
      setFormData({
        nama: profile.nama || profile.nama_lengkap || '',
        email: profile.email || '',
        lokasi: profile.lokasi || profile.alamat_domisili || ''
      });
      setErrors({});
    }
  }, [profile, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama || formData.nama.trim().length < 3) {
      newErrors.nama = 'Nama lengkap minimal 3 karakter';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.lokasi || formData.lokasi.trim().length < 5) {
      newErrors.lokasi = 'Alamat domisili minimal 5 karakter';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await updateUserProfile({ 
      ...formData, 
      id: profile?.id,
      nik: profile?.nik 
    });
    setLoading(false);
    
    if (result.success) {
      toast.success('Profil berhasil diperbarui');
      if (onUpdate) {
        onUpdate(result.data);
      }
      onClose();
    } else {
      toast.error(result.error || 'Gagal memperbarui profil');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profil">
      {/* Kartu Ringkas Identitas Warga */}
      <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-100/80 rounded-2xl p-3.5 mb-5 flex items-center gap-3.5 shadow-2xs">
        <div className="relative shrink-0">
          <img
            src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'citizen'}`}
            alt={profile?.nama || 'Avatar'}
            className="w-12 h-12 rounded-full object-cover bg-white ring-2 ring-blue-500/20 shadow-xs"
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5 ring-2 ring-white" title="Warga Terverifikasi">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-slate-900 truncate">
              {profile?.nama || 'Warga Lamongan'}
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
              <BadgeCheck className="w-3 h-3" />
              Terverifikasi
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Perbarui data diri untuk verifikasi dan tindak lanjut laporan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            Nama Lengkap
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap sesuai KTP"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-2xs"
          />
          {errors.nama && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.nama}
            </p>
          )}
        </div>

        {/* NIK (Terkunci Sesuai KTP) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Nomor Induk Kependudukan (NIK)
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              <Lock className="w-3 h-3" /> Terkunci
            </span>
          </div>
          <input
            type="text"
            value={profile?.nik || '-'}
            disabled
            readOnly
            className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-mono font-medium text-slate-600 select-all cursor-not-allowed tracking-wider"
          />
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0 text-slate-400" />
            NIK terdaftar permanen & tidak dapat diubah
          </p>
        </div>

        {/* Alamat Email */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nama@email.com"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-2xs"
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Lokasi Domisili (Textarea Multi-line agar tidak terpotong) */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Lokasi Domisili
          </label>
          <textarea
            rows={3}
            name="lokasi"
            value={formData.lokasi}
            onChange={handleChange}
            placeholder="Contoh: Desa Solokuro RT 02 / RW 01, Kecamatan Solokuro, Kabupaten Lamongan"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none shadow-2xs leading-relaxed"
          />
          {errors.lokasi ? (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.lokasi}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Alamat lengkap tempat tinggal untuk verifikasi wilayah aduan
            </p>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-50 transition active:scale-[0.98] disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition active:scale-[0.98] shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
