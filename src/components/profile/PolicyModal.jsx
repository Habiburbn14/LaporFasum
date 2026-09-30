import React from 'react';
import Modal from '../ui/Modal';
import { PRIVACY_POLICY_TEXT, TERMS_TEXT } from '../../utils/mockData';

function PolicyModal({ isOpen, onClose, type }) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Kebijakan Privasi Data' : 'Syarat & Ketentuan';
  const text = isPrivacy ? PRIVACY_POLICY_TEXT : TERMS_TEXT;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
          {text}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition text-sm"
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
}

export default PolicyModal;
