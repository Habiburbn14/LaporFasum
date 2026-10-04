import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import { DETAILED_FACILITY_DATA } from '../utils/mockData';

const CATEGORY_BG = {
  blue: 'from-blue-500 to-blue-600',
  violet: 'from-violet-500 to-violet-600',
  orange: 'from-orange-500 to-orange-600',
  amber: 'from-amber-500 to-amber-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
};

const STATUS_CONFIG = {
  'Baik': { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50', border: 'border-emerald-100' },
  'Perlu Perbaikan': { icon: AlertCircle, color: 'text-amber-600 bg-amber-50', border: 'border-amber-100' },
  'Rusak Sedang': { icon: AlertCircle, color: 'text-orange-600 bg-orange-50', border: 'border-orange-100' },
  'Rusak': { icon: AlertCircle, color: 'text-orange-600 bg-orange-50', border: 'border-orange-100' },
  'Rusak Berat': { icon: XCircle, color: 'text-red-600 bg-red-50', border: 'border-red-100' },
  'Tersumbat': { icon: XCircle, color: 'text-red-600 bg-red-50', border: 'border-red-100' },
};

function FacilityDetailPage() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const facility = DETAILED_FACILITY_DATA[id];
  
  if (!facility) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto flex flex-col items-center justify-center px-5">
        <h2 className="text-xl font-bold text-slate-800">Fasilitas tidak ditemukan</h2>
        <Link to="/fasilitas" className="mt-4 text-blue-600 hover:text-blue-800">
          Kembali ke daftar fasilitas
        </Link>
      </div>
    );
  }

  const filteredFacilities = facility.fasilitas.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kecamatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28">
      <header className={`bg-gradient-to-br ${CATEGORY_BG[facility.color || 'blue']} px-5 pt-6 pb-8 rounded-b-3xl relative overflow-hidden`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative mb-4 flex items-center justify-between">
          <Link to="/fasilitas" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
        </div>

        <div className="relative">
          <h1 className="text-white text-2xl font-bold leading-snug">
            {facility.nama}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {facility.jumlahUnit}
          </p>
        </div>
      </header>

      {/* <div className="px-5 -mt-8">
        <img
          src={facility.thumbnail}
          alt={facility.nama}
          className="w-full h-48 object-cover rounded-2xl shadow-lg"
        />
      </div> */}

      <div className="px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-900 text-lg mb-3">Deskripsi</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {facility.deskripsi}
          </p>
        </div>
      </div>

      <div className="px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900 text-lg">Daftar Lokasi</h2>
            <div className="text-sm text-slate-500">
              {filteredFacilities.length} dari {facility.fasilitas.length}
            </div>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari lokasi fasilitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="space-y-3">
            {filteredFacilities.map((item) => {
              const StatusIcon = STATUS_CONFIG[item.kondisi]?.icon || AlertCircle;
              const statusColor = STATUS_CONFIG[item.kondisi]?.color || 'text-slate-600 bg-slate-50';
              const statusBorder = STATUS_CONFIG[item.kondisi]?.border || 'border-slate-100';
              
              return (
                <div 
                  key={item.id} 
                  className={`p-3 border ${statusBorder} rounded-xl hover:shadow-sm transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.nama}</h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.lokasi}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          Kecamatan: {item.kecamatan}
                        </span>
                        <div className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          Baik
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>

      <div className="px-5 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-900 text-lg mb-3">Sejarah</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {facility.sejarah}
          </p>
        </div>
      </div>

      <div className="px-5 mt-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-900 text-lg mb-3">Peta Lokasi</h2>
          <div className="bg-slate-100 rounded-xl h-48 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10" />
            <div className="text-center z-10">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="text-slate-600 text-sm">
                {facility.fasilitas.length} titik lokasi tersebar di Lamongan
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Klik pada pin untuk detail koordinat
              </p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            {facility.fasilitas.slice(0, 4).map((item, index) => (
              <div key={index} className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                <div className="font-medium truncate">{item.nama}</div>
                <div className="text-slate-400 truncate">{item.lokasi}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default FacilityDetailPage;