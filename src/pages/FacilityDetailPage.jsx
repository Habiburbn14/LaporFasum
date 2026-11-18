import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MapPin,
  ArrowRight,
  Building2,
  X
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { masterAPI } from '../services/api';
import BottomNav from '../components/mobile/BottomNav';
import { formatDateFull } from '../utils/date';

const STATUS_STYLES = {
  'Aktif': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Tidak Aktif': 'bg-rose-100 text-rose-700 border-rose-200',
  'Perawatan': 'bg-amber-100 text-amber-700 border-amber-200',
  'Rusak': 'bg-red-100 text-red-700 border-red-200',
};

// Mapping kategori ID ke nama
const KATEGORI_NAMA = {
  '1': 'Jalan dan Jembatan',
  '2': 'Penerangan Jalan Umum (PJU)',
  '3': 'Saluran Air dan Drainase',
  '4': 'Pengelolaan Sampah dan Kebersihan',
  '5': 'Taman dan Ruang Terbuka Hijau (RTH)',
  '6': 'Fasilitas Kesehatan',
  '7': 'Fasilitas Pendidikan',
  '8': 'Rambu dan Marka Jalan',
  '9': 'Transportasi Publik (Halte, Terminal)',
  '10': 'Fasilitas Olahraga dan Rekreasi',
  '11': 'Pasar Tradisional',
  '12': 'Tempat Ibadah',
  '13': 'Fasilitas Pemerintahan dan Layanan Publik',
  '14': 'Fasilitas Keamanan dan Keselamatan (Polisi, Damkar)',
  '15': 'Pusat Perbelanjaan dan Fasilitas Ekonomi Modern',
  '16': 'Lainnya',
};

function FacilityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // id_kategori from URL
  const { user } = useAuthStore();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Helper functions dengan fallback sesuai field dari backend
  const getFacilityName = (f) =>
    f.nama_fasilitas || f.nama || f.name || f.title || '-';

  const getFacilityStatus = (f) =>
    f.status || f.kondisi || f.condition || f.state || 'Aktif';

  const getFacilityType = (f) =>
    f.nama_kategori ||
    f.tipe_fasilitas ||
    f.tipe ||
    f.type ||
    f.kategori ||
    f.category ||
    f.jenis ||
    (f.id_kategori ? `Kategori #${f.id_kategori}` : 'Fasilitas Umum');

  const getFacilityLocation = (f) => {
    const textLoc =
      f.alamat ||
      f.lokasi ||
      f.location ||
      f.address ||
      f.nama_kecamatan ||
      f.kecamatan ||
      f.district;
    if (textLoc) return textLoc;
    if (f.latitude != null && f.longitude != null) {
      return `${f.latitude}, ${f.longitude}`;
    }
    return 'Lamongan';
  };

  const getFacilityDescription = (f) =>
    f.deskripsi || f.description || f.desc || '';

  const getFacilityCondition = (f) =>
    f.kondisi || f.condition || f.kondisi_fisik || '';

  const getFacilityBuiltDate = (f) =>
    f.tanggal_dibangun ||
    f.tanggal_ibuat ||
    f.built_date ||
    f.tanggal_dibuat ||
    f.created_at ||
    '';

  const getFacilityLastUpdated = (f) =>
    f.last_updated ||
    f.updated_at ||
    f.tanggal_update ||
    f.tanggal_perbarui ||
    '';

  const fetchFacilities = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page,
          limit: itemsPerPage,
        };

        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (statusFilter !== 'Semua') params.status = statusFilter;

        // Gunakan endpoint baru dengan id_kategori dari URL params
        // Endpoint /master/fasilitas-umum/{id_kategori} hanya support page & limit
        // search dan status hanya untuk endpoint /master/fasilitas-umum (tanpa id)
        if (id) {
          // Untuk endpoint by kategori, hanya kirim page & limit
          const cleanParams = { page, limit: itemsPerPage };
          const result = await masterAPI.getFasilitasUmumByKategori(id, cleanParams);

          // Handle response parsing
          let payload = result;
          if (result?.data) {
            if (Array.isArray(result.data)) {
              payload = { data: result.data };
            } else if (result.data.data) {
              payload = result.data;
            }
          }

          const list = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : [];

          const pagination =
            payload?.pagination || result?.pagination || result?.data?.pagination;

          if (result?.success === false) {
            setError(result.error || result.message || 'Gagal memuat data fasilitas');
          } else {
            setFacilities(list);
            setCurrentPage(pagination?.page || page);
            setTotalPages(pagination?.total_pages || 1);
            setTotalItems(
              pagination?.total ?? pagination?.total_items ?? list.length
            );
          }
        } else {
          // Endpoint tanpa filter kategori - support search, status, page, limit
          const result = await masterAPI.getFasilitasUmum(params);

          let payload = result;
          if (result?.data) {
            if (Array.isArray(result.data)) {
              payload = { data: result.data };
            } else if (result.data.data) {
              payload = result.data;
            }
          }

          const list = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : [];

          const pagination =
            payload?.pagination || result?.pagination || result?.data?.pagination;

          if (result?.success === false) {
            setError(result.error || result.message || 'Gagal memuat data fasilitas');
          } else {
            setFacilities(list);
            setCurrentPage(pagination?.page || page);
            setTotalPages(pagination?.total_pages || 1);
            setTotalItems(
              pagination?.total ?? pagination?.total_items ?? list.length
            );
          }
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat data fasilitas');
      } finally {
        setLoading(false);
      }
    },
    [id, searchTerm, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFacilities(currentPage);
    }, 250);
    return () => clearTimeout(timer);
  }, [currentPage, fetchFacilities]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getCategoryName = (id) => KATEGORI_NAMA[id] || 'Fasilitas Umum';

  const getStatusStyle = (status) => {
    return STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading && facilities.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 font-sans flex flex-col justify-between">
        <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-8 pb-16 rounded-b-3xl relative overflow-hidden shadow-sm">
          <div className="relative">
            <h1 className="text-xl font-bold text-white tracking-tight">{getCategoryName(id)}</h1>
            <p className="text-xs text-blue-100 mt-1">Daftar fasilitas infrastruktur Lamongan</p>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm mt-2">Memuat fasilitas...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error && facilities.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 font-sans flex flex-col justify-between">
        <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-8 pb-16 rounded-b-3xl relative overflow-hidden shadow-sm">
          <div className="relative">
            <h1 className="text-xl font-bold text-white tracking-tight">{getCategoryName(id)}</h1>
            <p className="text-xs text-blue-100 mt-1">Daftar fasilitas infrastruktur Lamongan</p>
          </div>
        </header>
        <div className="flex-1 p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchFacilities(currentPage)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium"
          >
            Coba Lagi
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 max-w-[430px] mx-auto pb-28 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 px-5 pt-8 pb-16 rounded-b-3xl relative overflow-hidden shadow-sm">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-2 left-6 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/')} className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
<h1 className="text-xl font-bold text-white tracking-tight">{getCategoryName(id)}</h1>
            <p className="text-xs text-blue-100 mt-1">Data infrastruktur Kab. Lamongan</p>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama fasilitas..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Semua', 'Aktif', 'Tidak Aktif', 'Perawatan', 'Rusak'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Facility List */}
      <div className="px-4 pb-4">
        {facilities.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1">Tidak Ada Fasilitas</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ditemukan fasilitas yang cocok dengan filter saat ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {facilities.map((facility) => (
              <button
                key={facility.id_fasilitas || facility.id}
                onClick={() => {
                  setSelectedFacility(facility);
                  setShowDetail(true);
                }}
                className="w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start gap-3 text-left hover:border-slate-200 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {getFacilityName(facility)}
                    </h3>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${getStatusStyle(
                        getFacilityStatus(facility)
                      )}`}
                    >
                      {getFacilityStatus(facility)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1 line-clamp-1">
                    {getFacilityType(facility)}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{getFacilityLocation(facility)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-xl font-semibold text-sm transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedFacility && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center z-[1500] p-4"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="w-full max-w-[430px] max-h-[85vh] bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="font-bold text-slate-900">Detail Fasilitas</h3>
              <button
                onClick={() => setShowDetail(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-sm">
                      {getFacilityName(selectedFacility)}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusStyle(
                        getFacilityStatus(selectedFacility)
                      )}`}
                    >
                      {getFacilityStatus(selectedFacility)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Tipe / Kategori
                  </p>
                  <p className="font-medium text-slate-800">
                    {getFacilityType(selectedFacility)}
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Alamat / Lokasi
                  </p>
                  <p className="font-medium text-slate-800 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{getFacilityLocation(selectedFacility)}</span>
                  </p>
                </div>

                {selectedFacility.latitude != null && selectedFacility.longitude != null && (
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Koordinat
                    </p>
                    <p className="font-mono text-xs text-slate-700">
                      {selectedFacility.latitude}, {selectedFacility.longitude}
                    </p>
                  </div>
                )}

                {getFacilityDescription(selectedFacility) && (
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Deskripsi
                    </p>
                    <p className="text-slate-700">{getFacilityDescription(selectedFacility)}</p>
                  </div>
                )}

                {getFacilityCondition(selectedFacility) && (
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Kondisi
                    </p>
                    <p className="font-medium text-slate-800">
                      {getFacilityCondition(selectedFacility)}
                    </p>
                  </div>
                )}

                {getFacilityBuiltDate(selectedFacility) && (
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Dibangun
                    </p>
                    <p className="font-medium text-slate-800">
                      {getFacilityBuiltDate(selectedFacility)}
                    </p>
                  </div>
                )}

                {getFacilityLastUpdated(selectedFacility) && (
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Terakhir Diperbarui
                    </p>
                    <p className="font-medium text-slate-800">
                      {formatDateFull(getFacilityLastUpdated(selectedFacility))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}

export default FacilityDetailPage;