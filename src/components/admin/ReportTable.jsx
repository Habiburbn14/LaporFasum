import React from 'react';
import { Download, Eye } from 'lucide-react';
import { MOCK_FACILITY_CATEGORIES } from '../../utils/mockData';

function ReportTable({ 
  reports, 
  searchCategory, 
  setSearchCategory, 
  filterStatus, 
  setFilterStatus, 
  onStatusChange, 
  onViewDetail,
  showAll,
  setShowAll,
  totalFiltered
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-base">Laporan Masuk Terbaru</h2>
          <p className="text-xs text-slate-500 mt-0.5">Daftar aduan fasilitas umum yang memerlukan verifikasi cepat</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            {MOCK_FACILITY_CATEGORIES.map(c => (
              <option key={c.id} value={c.nama}>{c.nama}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diterima">Diterima</option>
            <option value="Selesai">Selesai</option>
          </select>

          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-6">ID Laporan</th>
              <th className="py-3.5 px-6">Pelapor</th>
              <th className="py-3.5 px-6">Kategori & Lokasi</th>
              <th className="py-3.5 px-6">Tanggal</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 font-semibold text-blue-600">{report.ticket_code}</td>
                <td className="py-4 px-6">
                  <p className="font-medium text-slate-800">{report.pelapor}</p>
                  <p className="text-xs text-slate-400">+62 812-3456-7890</p>
                </td>
                <td className="py-4 px-6 max-w-xs">
                  <p className="font-medium text-slate-800 truncate">{report.kategori}</p>
                  <p className="text-xs text-slate-400 truncate">{report.judul} - {report.kecamatan}</p>
                </td>
                <td className="py-4 px-6 text-xs text-slate-600">
                  {new Date(report.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Menunggu Verifikasi' ? 'bg-amber-50 text-amber-700' :
                    report.status === 'Diterima' ? 'bg-blue-50 text-blue-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      report.status === 'Menunggu Verifikasi' ? 'bg-amber-500' :
                      report.status === 'Diterima' ? 'bg-blue-500' :
                      'bg-emerald-500'
                    }`} />
                    {report.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="inline-flex items-center gap-2">
                    <select
                      value={report.status}
                      onChange={(e) => onStatusChange(report.id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Diterima">Diterima</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                    <button 
                      onClick={() => onViewDetail(report)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalFiltered > 10 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${totalFiltered} Laporan)`}
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportTable;
