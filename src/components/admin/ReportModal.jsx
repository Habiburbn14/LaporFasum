import React from 'react';

function ReportModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-lg">Detail Laporan - {report.ticket_code}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          <img src={report.foto} alt="Bukti" className="w-full h-48 object-cover rounded-xl" />
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold">Judul & Kategori</p>
            <p className="font-semibold text-slate-800 text-sm">{report.judul}</p>
            <p className="text-xs text-blue-600 font-medium">{report.kategori}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold">Lokasi & Kecamatan</p>
            <p className="text-sm text-slate-700">{report.kecamatan}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold">Deskripsi</p>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{report.deskripsi}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
