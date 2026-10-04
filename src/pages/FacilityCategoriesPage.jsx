import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import {
  Route as RouteIcon,
  Lightbulb,
  Waves,
  Trash2,
  Trees,
  Building2,
  GraduationCap,
  Signpost,
  Bus,
  Trophy,
  ShoppingBag,
  Landmark,
  ShieldCheck,
  Store,
} from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';
import { KATEGORI_FASILITAS_ARRAY } from '../utils/kategoriFasilitas';

const CATEGORY_ICONS = {
  jalan: RouteIcon,
  pju: Lightbulb,
  drainase: Waves,
  sampah: Trash2,
  taman: Trees,
  kesehatan: Building2,
  pendidikan: GraduationCap,
  rambu: Signpost,
  transportasi: Bus,
  olahraga: Trophy,
  pasar: ShoppingBag,
  ibadah: Landmark,
  pemerintah: Landmark,
  keamanan: ShieldCheck,
  perbelanjaan: Store,
};

const CATEGORY_COLORS = {
  blue: 'bg-blue-50 text-blue-600',
  violet: 'bg-violet-50 text-violet-600',
  orange: 'bg-orange-50 text-orange-600',
  amber: 'bg-amber-50 text-amber-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  pink: 'bg-pink-50 text-pink-600',
};

const CATEGORY_BG = {
  blue: 'from-blue-500 to-blue-600',
  violet: 'from-violet-500 to-violet-600',
  orange: 'from-orange-500 to-orange-600',
  amber: 'from-amber-500 to-amber-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
  red: 'from-red-500 to-red-600',
  pink: 'from-pink-500 to-pink-600',
};

function FacilityCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = KATEGORI_FASILITAS_ARRAY.filter((cat) =>
    cat.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28">
      <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-6 pb-8 rounded-b-3xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/5 rounded-full" />

        <div className="relative mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
        </div>

        <div className="relative">
          <h1 className="text-white text-2xl font-bold leading-snug">
            Daftar Fasilitas Umum
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Telusuri informasi lengkap fasilitas publik di Lamongan
          </p>
        </div>
      </header>

      <div className="px-5 mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari fasilitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="px-5 mt-6 mb-6">
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] || Building2;
              return (
                <Link
                   key={cat.id_kategori}
                   to={`/fasilitas/${cat.id_kategori}`}
                   className="group"
                 >
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300">
                     <div className={`bg-gradient-to-br ${CATEGORY_BG[cat.color]} p-6 flex items-center justify-center h-32 relative overflow-hidden`}>
                       <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                       <Icon className="w-12 h-12 text-white relative z-10" />
                     </div>
                     <div className="p-4">
                       <h3 className="font-semibold text-slate-900 text-center group-hover:text-blue-600 transition-colors">
                         {cat.nama_kategori}
                       </h3>
                     </div>
                   </div>
                 </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500">Tidak ada fasilitas yang sesuai dengan pencarian Anda</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default FacilityCategoriesPage;
