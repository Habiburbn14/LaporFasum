# LaporFasum - Sistem Informasi dan Pelaporan Fasilitas Umum Kabupaten Lamongan

Platform pelaporan dan informasi fasilitas umum berbasis web untuk warga Kabupaten Lamongan dengan integrasi peta interaktif dan deteksi AI.

## 🚀 Fitur Utama

### Untuk Warga
- **📍 Sistem Informasi Fasilitas**: Browse 12 kategori fasilitas umum dengan detail lokasi, sejarah, dan kondisi
- **📸 Pelaporan Berbasis AI**: 
  - Ambil foto langsung dari kamera device
  - AI auto-deteksi lokasi dan kategori kerusakan
  - Preview laporan sebelum submit
- **🎫 Tracking Real-time**: Lacak status laporan dengan kode tiket unik (format: LPF-YYYYXXXXX)
- **📱 Responsive Design**: Optimized untuk mobile (max-width: 430px)

### Untuk Admin Desa/Kecamatan
- **📊 Dashboard Wilayah**: Kelola laporan sesuai kecamatan tugas
- **✏️ Update Status**: Verifikasi dan ubah status laporan
- **🔍 Filter & Search**: Cari laporan berdasarkan status dan kategori

### Untuk Admin Master (Kabupaten)
- **📈 Dashboard Analytics**: Statistik laporan seluruh kabupaten
- **🗺️ Heatmap**: Visualisasi wilayah dengan laporan terbanyak
- **⚙️ Management**: Kelola kategori, kecamatan, dan pengguna
- **📋 SLA Monitoring**: Deteksi laporan yang perlu eskalasi (>7 hari)

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** (Fast build tool)
- **Tailwind CSS** (Styling)
- **React Router v6** (Routing)
- **Lucide React** (Icons)
- **React Hot Toast** (Notifications)
- **Leaflet** + **React-Leaflet** (Interactive maps - future)

### Backend (Akan dikerjakan terpisah)
- **Node.js** + **Express.js**
- **MySQL** (Database)
- **JWT** (Authentication)

## 📁 Struktur Proyek

```
sistim-pelaporan-warga/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx                    # Halaman utama
│   │   │   ├── FacilityCategoriesPage.jsx      # Daftar kategori fasilitas
│   │   │   ├── FacilityDetailPage.jsx          # Detail kategori & lokasi
│   │   │   ├── ReportPage.jsx                  # Flow pelaporan (Camera → Form → Preview → Success)
│   │   │   ├── TrackingPage.jsx                # Pelacakan laporan
│   │   │   ├── ProfilePage.jsx                 # Profil pengguna
│   │   │   ├── LoginPage.jsx                   # Login pengguna
│   │   │   ├── RegisterPage.jsx                # Registrasi pengguna
│   │   │   ├── AdminLoginPage.jsx              # Login admin
│   │   │   └── DashboardAdminMaster.jsx        # Dashboard admin (desktop)
│   │   ├── components/
│   │   │   ├── mobile/
│   │   │   │   ├── BottomNav.jsx               # Navigasi bawah (5 menu utama)
│   │   │   │   └── WeeklyChart.jsx             # Grafik mingguan/bulanan
│   │   │   ├── admin/
│   │   │   │   ├── AdminHeader.jsx             # Header admin dengan search & user
│   │   │   │   ├── AdminSidebar.jsx            # Sidebar navigation admin
│   │   │   │   ├── StatsCards.jsx              # Card statistik
│   │   │   │   └── ReportTable.jsx             # Tabel laporan masuk
│   │   │   ├── profile/                        # Modal komponen profil
│   │   │   ├── ui/                             # Komponen UI universal
│   │   │   └── (Navbar, Footer, MapPicker)
│   │   ├── services/
│   │   │   ├── api.js                          # API calls general
│   │   │   ├── authApi.js                      # API autentikasi
│   │   │   ├── userApi.js                      # API user
│   │   │   └── geolocation.js                  # GPS & reverse geocoding
│   │   ├── utils/
│   │   │   └── mockData.js                     # Data mock untuk simulasi (12 kategori, 60+ lokasi, 6+ laporan)
│   │   ├── App.jsx                             # Root component dengan routing
│   │   └── main.jsx                            # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js                   # Autentikasi logic
│   │   ├── laporanController.js                # Laporan CRUD
│   │   ├── masterController.js                 # Master data & analytics
│   │   ├── trackingController.js               # Pelacakan laporan
│   │   └── adminController.js                  # Admin functions
│   ├── routes/
│   │   ├── auth.js
│   │   ├── laporan.js
│   │   ├── master.js
│   │   ├── tracking.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js                             # JWT verification
│   ├── db.js                                   # Database connection
│   ├── server.js                               # Server entry point
│   └── package.json
│
└── README.md (this file)
```

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js v16+
- Git

### Install Dependencies
```bash
cd frontend
npm install
```

### Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5174`

### Build untuk Production
```bash
npm run build
```

## 📊 Mock Data

### Kecamatan Lamongan (8 wilayah)
- Lamongan
- Sambirejo
- Mantup
- Sugio
- Glagah
- Modo
- Pucuk
- Paciran

### Kategori Fasilitas (12 kategori)
1. Jalan dan Jembatan (LPF-JLN-XXX)
2. Penerangan Jalan Umum (PJU) (LPF-PJU-XXX)
3. Saluran Air dan Drainase (LPF-DRN-XXX)
4. Pengelolaan Sampah dan Kebersihan (LPF-SMP-XXX)
5. Taman dan Ruang Terbuka Hijau (RTH) (LPF-RTH-XXX)
6. Fasilitas Kesehatan (LPF-KES-XXX)
7. Fasilitas Pendidikan (LPF-PND-XXX)
8. Rambu dan Marka Jalan (LPF-RAM-XXX)
9. Transportasi Publik (Halte, Terminal) (LPF-TRN-XXX)
10. Fasilitas Olahraga dan Rekreasi (LPF-OLH-XXX)
11. Pasar Tradisional (LPF-PSR-XXX)
12. Tempat Ibadah (LPF-IBD-XXX)

### Status Laporan
1. **Menunggu Verifikasi** - Baru masuk, belum dilihat admin
2. **Diterima** - Sedang ditangani/diproses
3. **Selesai** - Masalah sudah diselesaikan

## 🔐 Role & Access Control

### Warga
- Melihat sistem informasi 12 kategori fasilitas
- Membuat laporan baru dengan AI detection
- Melihat laporan sendiri + tracking status
- Manajemen profil

### Admin Desa/Kecamatan
- Dashboard laporan di wilayah tugasnya
- Verifikasi dan update status laporan
- Filter & search laporan

### Admin Master (Kabupaten Lamongan)
- View seluruh laporan kabupaten
- Analytics & statistik
- Manajemen kategori dan pengguna
- Heatmap visualisasi

## 📱 Fitur Pelaporan (Multi-Step Flow)

### Step 1: Ambil Foto
- Kamera device terbuka otomatis
- Upload dari galeri atau ambil langsung

### Step 2: AI Detection & Form
- AI auto-detect lokasi & kategori kerusakan
- User bisa edit deskripsi kerusakan
- Menampilkan tag "AI: Lokasi Terdeteksi"

### Step 3: Preview Laporan
- Review semua data sebelum submit
- Menampilkan: Foto, Lokasi, Kategori, Deskripsi, Waktu, Koordinat GPS
- Tombol "Edit Laporan" atau "Kirim Final"

### Step 4: Success
- Loading indicator 1.5 detik
- Menampilkan ticket ID unik
- Tombol kembali ke beranda

## 📊 Dashboard Admin (Desktop View)

Menampilkan:
- **Header**: Search bar, notification bell, user profile
- **Sidebar**: Navigation (Dashboard, Triage, Analytics, Settings, Logout)
- **Stats Cards**: Total, Menunggu Tinjauan, Diproses, Selesai
- **Charts**: Grafik tren laporan mingguan/bulanan
- **Map**: Sebaran lokasi laporan interaktif
- **Table**: Laporan terbaru dengan filter & sorting
- **Modal Detail**: Review laporan dan update status

## 🔗 API Endpoints (Backend - Coming Soon)

```
# Authentication
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout

# Laporan
POST   /api/laporan/create
GET    /api/laporan/list
GET    /api/laporan/{id}
PUT    /api/laporan/{id}/status

# Tracking
GET    /api/tracking/{ticket_code}

# Admin
GET    /api/admin/dashboard
GET    /api/admin/reports
PUT    /api/admin/reports/{id}

# Master
GET    /api/master/analytics
GET    /api/master/heatmap
```

## 📈 Statistik Proyek

- **Total Pages**: 9 halaman (8 user + 1 admin desktop)
- **Total Components**: 25+ komponen reusable
- **Facility Categories**: 12 kategori dengan 60+ lokasi detail
- **Mock Reports**: 6 laporan simulasi dengan berbagai status
- **Responsive**: Mobile optimized (max-width: 430px) + Desktop (1200px+)

## 🔄 Roadmap & TODO

### Phase 1: Frontend Completion ✅
- [x] Sistem informasi fasilitas umum (12 kategori)
- [x] Multi-step report form dengan AI detection
- [x] Preview laporan sebelum submit
- [x] Loading indicator & success screen
- [x] Responsive mobile design
- [x] Bottom navigation dengan 5 menu utama
- [x] Validasi laporan dengan timestamp & GPS

### Phase 2: Authentication & Admin (In Progress)
- [ ] Login/Register pengguna dengan simulasi
- [ ] Admin login dengan kredensial statis
- [ ] Session management dengan localStorage
- [ ] Protect routes untuk admin
- [ ] Dashboard admin desktop view
- [ ] Stats cards & charts
- [ ] Laporan table dengan filter/sort
- [ ] Modal detail laporan & status update

### Phase 3: Advanced Features (Planned)
- [ ] Peta GIS interaktif dengan Leaflet
- [ ] Analytics & reporting tools
- [ ] Heatmap visualization
- [ ] Push notifications
- [ ] Export laporan (PDF/Excel)

### Phase 4: Backend Integration (Future)
- [ ] Connect API endpoints ke mock data
- [ ] Database setup & migrations
- [ ] JWT authentication
- [ ] Real GPS reverse geocoding
- [ ] File upload untuk foto laporan
- [ ] SLA checker (APScheduler)

## 🛠️ Teknologi yang Digunakan

### Frontend
- React 18.2
- Vite 8.2
- Tailwind CSS 3.4
- React Router 6
- Lucide React (Icons)
- React Hot Toast (Notifications)

### Backend
- Node.js
- Express.js
- MySQL2/Promise
- dotenv

### Development Tools
- ESLint
- Git & GitHub
- Vite dev server

## 🎨 Design System

- **Color Palette**: Blue (#2563eb) & Violet (#7c3aed) sebagai primary
- **Typography**: Tailwind default dengan custom sizing
- **Icons**: Lucide React untuk semua ikon
- **Responsive**: Mobile-first approach

## 📝 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pelaporan
PORT=3000
JWT_SECRET=your_secret_key
```

### Frontend (.env) - Optional
```
VITE_API_URL=http://localhost:3000/api
```

## 🤝 Kontribusi

Untuk berkontribusi pada proyek ini:
1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Kontak & Support

**Project Lead**: Habiburahman Rabbani  
**GitHub**: [@Habiburbn14](https://github.com/Habiburbn14)

Untuk pertanyaan atau saran, silakan buka issue di GitHub repository.

## 📄 License

Project ini adalah tugas akademik untuk Semester 3 - Universitas (2026).

---

**Dibuat dengan ❤️ untuk Warga Kabupaten Lamongan**

**Last Updated**: 1 Oktober 2026  
**Version**: 1.0.0 (Alpha)
