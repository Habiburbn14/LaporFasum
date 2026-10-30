import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMyReports, getReportsByFilter, getMapPoints } from '../services/userApi';

export const useReportStore = create(
  persist(
    (set, get) => ({
      reports: [],
      mapReports: [],
      loading: false,
      error: null,
      lastFetched: null,
      cacheExpiry: 5 * 60 * 1000,

      fetchReports: async () => {
        const { lastFetched } = get();
        const now = Date.now();

        if (lastFetched && now - lastFetched < get().cacheExpiry) {
          return;
        }

        set({ loading: true, error: null });

        try {
          const result = await getMyReports();

          if (result.success) {
            const data = result.data?.data || result.data || [];
            const mappedReports = data.map((r, idx) => ({
              id: r.id_laporan || idx,
              ticket_code: r.id_laporan || '',
              judul: r.judul_laporan || 'Tanpa Judul',
              deskripsi: r.deskripsi_laporan || '',
              status: r.status_terkini || 'Menunggu Verifikasi',
              foto: r.foto_bukti || '',
              kategori: r.nama_kategori || 'Lainnya',
              kecamatan: r.nama_kecamatan || '-',
              tanggal: r.created_at || '',
              created_at: r.created_at || '',
              tanggapan: r.tanggapan || null,
              tanggal_tanggapan: r.tanggal_tanggapan || null,
              lat: r.lat ?? r.latitude,
              lng: r.lng ?? r.longitude,
            }));

            set({
              reports: mappedReports,
              loading: false,
              lastFetched: now,
            });
          } else {
            set({
              error: result.error || 'Gagal memuat laporan',
              loading: false,
            });
          }
        } catch (err) {
          set({
            error: err.message || 'Gagal memuat laporan',
            loading: false,
          });
        }
      },

      fetchAllReports: async () => {
        set({ loading: true, error: null });

        try {
          const result = await getReportsByFilter('all');

          if (result.success) {
            const data = result.data?.data || result.data || [];
            const mappedReports = data.map((r, idx) => ({
              id: r.id_laporan || idx,
              ticket_code: r.id_laporan || '',
              judul: r.judul_laporan || 'Tanpa Judul',
              deskripsi: r.deskripsi_laporan || '',
              status: r.status_terkini || 'Menunggu Verifikasi',
              foto: r.foto_bukti || '',
              kategori: r.nama_kategori || 'Lainnya',
              kecamatan: r.nama_kecamatan || '-',
              tanggal: r.created_at || '',
              created_at: r.created_at || '',
              tanggapan: r.tanggapan || null,
              tanggal_tanggapan: r.tanggal_tanggapan || null,
              lat: r.lat ?? r.latitude,
              lng: r.lng ?? r.longitude,
            }));

            set({ reports: mappedReports, loading: false });
          } else {
            set({ error: result.error || 'Gagal memuat laporan', loading: false });
          }
        } catch (err) {
          set({ error: err.message || 'Gagal memuat laporan', loading: false });
        }
      },

      fetchMapPoints: async () => {
        try {
          const result = await getMapPoints();
          if (result.success && result.data.type === 'FeatureCollection') {
            const mapped = result.data.features.map(f => ({
              id: f.properties.id_laporan,
              judul: f.properties.judul_laporan,
              status: f.properties.status_terkini,
              kategori: f.properties.kategori,
              lng: f.geometry.coordinates[0],
              lat: f.geometry.coordinates[1],
              ticket_code: f.properties.id_laporan,
            }));
            set({ mapReports: mapped });
          }
        } catch (err) {
          console.error('Map points fetch error:', err);
        }
      },

      clearCache: () => set({ reports: [], mapReports: [], lastFetched: null, error: null }),
    }),
    {
      name: 'report-storage',
    }
  )
);
