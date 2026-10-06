import React from 'react';
import { FileText, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Laporan</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">↑ +12% dari bulan lalu</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menunggu Tinjauan</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{stats.menunggu}</p>
          <span className="text-xs text-amber-600 font-medium mt-1 inline-block">! Perlu Aksi Cepat</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sedang Diproses</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.diproses}</p>
          <span className="text-xs text-blue-600 font-medium mt-1 inline-block">Tim Lapangan Aktif</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <AlertCircle className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selesai Diperbaiki</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.selesai}</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">96% Tepat Waktu</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
