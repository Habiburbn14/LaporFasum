import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { submitFeedback } from '../../services/userApi';
import toast from 'react-hot-toast';

function FeedbackModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ subjek: '', pesan: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.pesan.length < 10) {
      toast.error('Pesan minimal 10 karakter');
      return;
    }
    
    setLoading(true);
    const result = await submitFeedback(formData);
    setLoading(false);
    
    if (result.success) {
      toast.success('Feedback berhasil dikirim');
      onClose();
    } else {
      toast.error('Gagal mengirim feedback');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Beri Feedback">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subjek</label>
          <input
            required
            type="text"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Contoh: Saran Fitur, Bug..."
            value={formData.subjek}
            onChange={(e) => setFormData(prev => ({ ...prev, subjek: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="Tuliskan saran atau kendala Anda..."
            value={formData.pesan}
            onChange={(e) => setFormData(prev => ({ ...prev, pesan: e.target.value }))}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? 'Mengirim...' : 'Kirim Feedback'}
        </button>
      </form>
    </Modal>
  );
}

export default FeedbackModal;
