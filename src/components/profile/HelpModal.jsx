import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { FAQ_DATA } from '../../utils/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

function HelpModal({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pusat Bantuan">
      <div className="space-y-3">
        {FAQ_DATA.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl border border-slate-100 transition-all ${
                isOpen ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/50'
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-semibold text-slate-800">{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-6 border-t border-slate-100">
          <p className="text-center text-sm text-slate-500 mb-4">
            Butuh bantuan lebih lanjut?
          </p>
          <a
            href="mailto:lapor@lamongan.go.id"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Hubungi Customer Service
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default HelpModal;
