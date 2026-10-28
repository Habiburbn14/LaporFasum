import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search, Route, Lightbulb, Waves, Trees, Building2,
  GraduationCap, Navigation, Bus, Dumbbell, Store, Church,
  Landmark, Shield, ShoppingBag, LayoutGrid
} from 'lucide-react';
import BottomNav from '../components/mobile/BottomNav';

const FACILITY_CATEGORIES = [
  { id: 1,  nama: 'Jalan dan Jembatan', icon: 'jalan', color: 'orange' },
  { id: 2,  nama: 'Penerangan Jalan Umum (PJU)', icon: 'pju', color: 'amber' },
  { id: 3,  nama: 'Saluran Air dan Drainase', icon: 'drainase', color: 'cyan' },
  { id: 4,  nama: 'Pengelolaan Sampah dan Kebersihan', icon: 'sampah', color: 'emerald' },
  { id: 5,  nama: 'Taman dan Ruang Terbuka Hijau (RTH)', icon: 'taman', color: 'emerald' },
  { id: 6,  nama: 'Fasilitas Kesehatan', icon: 'kesehatan', color: 'blue' },
  { id: 7,  nama: 'Fasilitas Pendidikan', icon: 'pendidikan', color: 'violet' },
  { id: 8,  nama: 'Rambu dan Marka Jalan', icon: 'rambu', color: 'orange' },
  { id: 9,  nama: 'Transportasi Publik (Halte, Terminal)', icon: 'transportasi', color: 'amber' },
  { id: 10, nama: 'Fasilitas Olahraga dan Rekreasi', icon: 'olahraga', color: 'emerald' },
  { id: 11, nama: 'Pasar Tradisional', icon: 'pasar', color: 'blue' },
  { id: 12, nama: 'Tempat Ibadah', icon: 'ibadah', color: 'violet' },
  { id: 13, nama: 'Fasilitas Pemerintahan dan Layanan Publik', icon: 'pemerintah', color: 'blue' },
  { id: 14, nama: 'Fasilitas Keamanan dan Keselamatan (Polisi, Damkar)', icon: 'keamanan', color: 'red' },
  { id: 15, nama: 'Pusat Perbelanjaan dan Fasilitas Ekonomi Modern', icon: 'perbelanjaan', color: 'pink' },
  { id: 16, nama: 'Lainnya', icon: 'lainnya', color: 'slate' },
];

const CATEGORY_ICONS = {
  jalan: Route,
  pju: Lightbulb,
  drainase: Waves,
  sampah: Waves,
  taman: Trees,
  kesehatan: Building2,
  pendidikan: GraduationCap,
  rambu: Navigation,
  transportasi: Bus,
  olahraga: Dumbbell,
  pasar: Store,
  ibadah: Church,
  pemerintah: Landmark,
  keamanan: Shield,
  perbelanjaan: ShoppingBag,
  lainnya: LayoutGrid,
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
  slate: 'from-slate-500 to-slate-600',
};

function FacilityCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = FACILITY_CATEGORIES.filter((cat) =>
    cat.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-107.5 mx-auto pb-28">
      <header className="bg-linear-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-6 pb-8 rounded-b-3xl relative overflow-hidden">
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
              const Icon = CATEGORY_ICONS[cat.icon] || LayoutGrid;
              return (
                <Link
                  key={cat.id}
                  to={`/fasilitas/${cat.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-300">
                    <div className={`bg-linear-to-br ${CATEGORY_BG[cat.color]} p-6 flex items-center justify-center h-32 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                      <Icon className="w-12 h-12 text-white relative z-10" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 text-center group-hover:text-blue-600 transition-colors">
                        {cat.nama}
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
