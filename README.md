# Sistem Pelaporan Warga Berbasis Peta - Kota Surabaya

Platform pelaporan masalah publik berbasis web dengan integrasi peta interaktif untuk warga Kota Surabaya.

## 🚀 Fitur Utama

### Untuk Warga
- **Pelaporan Interaktif**: Drop pin di peta dengan auto-detect lokasi (HTML5 Geolocation)
- **Tracking Real-time**: Lacak status laporan dengan kode tiket unik (format: SBY-XXX-001)
- **Upload Foto**: Dokumentasi visual masalah publik
- **Timeline Visual**: Lihat progres laporan secara transparan

### Untuk Admin Desa/Kecamatan
- **Dashboard Wilayah**: Kelola laporan sesuai kecamatan tugas
- **Update Status**: Verifikasi dan ubah status laporan
- **Filter & Search**: Cari laporan berdasarkan status dan kategori

### Untuk Admin Master (Kota)
- **Dashboard Analytics**: Statistik laporan seluruh kota
- **Monitoring SLA**: Deteksi laporan yang perlu eskalasi (>7 hari)
- **Heatmap**: Visualisasi wilayah dengan laporan terbanyak
- **Management**: Override dan reassign laporan

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite** (Fast build tool)
- **Tailwind CSS** (Styling)
- **Leaflet** + **React-Leaflet** (Interactive maps)
- **Axios** (HTTP client)
- **React Router** (Routing)
- **Lucide React** (Icons)

### Backend (Akan dikerjakan terpisah)
- **Flask** + **SQLAlchemy**
- **MySQL** (Database)
- **JWT** (Authentication)
- **APScheduler** (SLA checker)

## 📁 Struktur Proyek

```
frontend/
├── src/
│   ├── components/
│   │   ├── MapPicker.jsx       # Komponen peta interaktif
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── Footer.jsx          # Footer
│   ├── pages/
│   │   ├── LandingPage.jsx     # Halaman utama
│   │   ├── ReportPage.jsx      # Form pelaporan + peta
│   │   ├── TrackingPage.jsx    # Lacak status tiket
│   │   ├── LoginPage.jsx       # Login warga/admin
│   │   └── DashboardAdminMaster.jsx  # Dashboard admin
│   ├── services/
│   │   ├── api.js              # Axios config + API endpoints
│   │   └── geolocation.js      # HTML5 Geolocation wrapper
│   ├── utils/
│   │   └── mockData.js         # Mock data (kecamatan, kategori, laporan)
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles (Tailwind)
```

## 🚀 Cara Menjalankan

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

### Build untuk Production
```bash
npm run build
```

## 📊 Mock Data

### Kecamatan Surabaya (8 wilayah)
- Gubeng
- Sukolilo
- Rungkut
- Wonokromo
- Tegalsari
- Genteng
- Bubutan
- Kenjeran

### Kategori Laporan
1. Jalan Rusak (SBY-JLN-XXX)
2. Sampah Menumpuk (SBY-SMP-XXX)
3. Lampu Jalan Mati (SBY-LMP-XXX)
4. Drainase Tersumbat (SBY-DRN-XXX)
5. Lainnya (SBY-OTH-XXX)

### Status Laporan
1. **Menunggu Verifikasi** - Baru masuk, belum dilihat admin
2. **Diterima** - Sedang ditangani/diproses
3. **Selesai** - Masalah sudah diselesaikan

## 🔐 Role & Access Control (RBAC)

### Warga
- Membuat laporan baru
- Melihat laporan sendiri
- Tracking status dengan kode tiket

### Admin Desa/Kecamatan
- Dashboard laporan di wilayah tugasnya
- Verifikasi dan update status laporan
- Upload foto bukti perbaikan

### Admin Master (Kota Surabaya)
- View seluruh laporan kota
- Analytics & heatmap
- Eskalasi manual
- Manajemen kategori

## 🗺️ Fitur Peta

### Auto-Detect Lokasi
- Menggunakan HTML5 Geolocation API
- Akurasi ±10 meter
- Fallback ke dropdown manual jika ditolak user

### Interactive Map (Leaflet)
- Click & drag marker untuk pinpoint lokasi
- Zoom in/out untuk detail
- Reverse geocoding untuk mendapatkan nama wilayah
- OpenStreetMap tiles (gratis)

## 🔗 API Endpoints (Backend - Coming Soon)

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/laporan/create
GET    /api/laporan/list
GET    /api/tracking/{ticket_code}
PUT    /api/admin/laporan/{id}/status
GET    /api/master/analytics
GET    /api/master/reports
```

## 📝 Database Schema

Lihat file `schema.sql` untuk struktur lengkap:
- `master_kabupaten`
- `master_kecamatan`
- `roles`
- `kategori_fasilitas`
- `users`
- `laporan`
- `riwayat_status_laporan`

## 🎨 Design Principles

- **Mobile-First**: Responsif untuk HP (warga melapor di lapangan)
- **Clean & Simple**: UI intuitif untuk semua kalangan
- **Transparent**: Warga bisa tracking progres kapan saja
- **Accessible**: Kontras warna dan font size yang jelas

## 🚧 Roadmap

### Phase 1 - Frontend (✅ COMPLETED)
- [x] Setup React + Vite + Tailwind
- [x] Komponen peta interaktif
- [x] Halaman pelaporan dengan geolocation
- [x] Halaman tracking tiket
- [x] Dashboard admin master
- [x] Mock data & routing

### Phase 2 - Backend Integration (Coming)
- [ ] Setup Flask + MySQL
- [ ] Implementasi API endpoints
- [ ] JWT authentication
- [ ] File upload handling
- [ ] SLA checker (APScheduler)

### Phase 3 - Advanced Features (Future)
- [ ] Push notifications
- [ ] Email notifications
- [ ] Heatmap visualization
- [ ] Export laporan (PDF/Excel)
- [ ] Multi-language support

## 👥 Tim Pengembang

- **Frontend**: [Your Name]
- **Backend**: [Your Friend's Name]

## 📄 License

[Add your license here]

## 📞 Kontak

Untuk pertanyaan atau dukungan, hubungi:
- Email: lapor@surabaya.go.id
- GitHub: [Your GitHub]

---

**Dibuat dengan ❤️ untuk Warga Surabaya**
