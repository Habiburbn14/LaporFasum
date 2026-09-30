import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { uploadAvatar } from '../../services/userApi';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';

function AvatarUploadModal({ isOpen, onClose, currentAvatar, onUpdate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentAvatar);
  const [mode, setMode] = useState('generate');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setSelectedFile(file);
      setMode('upload');
    }
  };

  const handleGenerateAvatar = () => {
    setMode('generate');
    setSelectedFile(null);
    const seed = `avatar-${Date.now()}`;
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setPreview(url);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await uploadAvatar(mode === 'generate' ? null : selectedFile);
    setLoading(false);
    
    if (result.success) {
      toast.success('Foto profil berhasil diperbarui');
      onUpdate(result.url || result.data.avatar);
      onClose();
    } else {
      toast.error(result.error || 'Gagal mengunggah foto');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Foto Profil">
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100 shadow-lg"
            />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGenerateAvatar}
            className={`p-4 rounded-xl border-2 transition-all ${
              mode === 'generate'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <User className="w-8 h-8 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">Generate Random</span>
            </div>
          </button>

          <label className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            mode === 'upload'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
          }`}>
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-slate-700">Upload Foto</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {mode === 'upload' && selectedFile && (
          <div className="bg-slate-50 p-3 rounded-xl text-center">
            <p className="text-sm text-slate-600">File: <span className="font-medium">{selectedFile.name}</span></p>
            <p className="text-xs text-slate-400 mt-1">Format: {selectedFile.type.split('/')[1].toUpperCase()} | Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Foto'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AvatarUploadModal;
