export const MOCK_USER_PROFILE = {
  id: 1,
  nama: "Habiburahman Rabbani",
  nik: "3524 **** **** 1234",
  raw_nik: "3524211234561234",
  email: "habib.rabbani@lamongankab.go.id",
  lokasi: "Kec. Deket, Lamongan",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  phone: "+6281234567890",
  joinDate: "2026-01-15",
  isVerified: true
};

export const FAQ_DATA = [
  {
    q: "Bagaimana cara membuat laporan?",
    a: "Klik tombol 'Lapor' di menu bawah, isi formulir dengan lengkap, lampirkan foto kondisi fasilitas, tentukan lokasi di peta, lalu kirim laporan Anda."
  },
  {
    q: "Berapa lama laporan saya akan diproses?",
    a: "Laporan umumnya akan diverifikasi oleh petugas dalam 1-3 hari kerja sebelum diteruskan ke dinas terkait."
  },
  {
    q: "Bagaimana cara melacak progress laporan?",
    a: "Anda dapat melihat daftar laporan Anda melalui menu 'Laporan' di navigasi bawah atau memasukkan kode tiket pada halaman lacak."
  },
  {
    q: "Siapa yang dapat saya hubungi jika ada kendala?",
    a: "Anda bisa mengirimkan pesan melalui menu 'Beri Feedback' di halaman profil atau menghubungi email resmi lapor@lamongan.go.id"
  }
];

export const PRIVACY_POLICY_TEXT = `Kebijakan Privasi Data LaporFasum Lamongan:

1. Pengumpulan Informasi
Kami mengumpulkan informasi pribadi yang Anda berikan secara sukarela saat mendaftar, seperti nama, NIK, email, nomor telepon, dan lokasi domisili. Informasi ini digunakan untuk keperluan verifikasi dan penanganan aduan fasilitas umum.

2. Penggunaan Data
Data Anda hanya digunakan untuk keperluan pelayanan pengaduan warga Kabupaten Lamongan. Kami tidak akan membagikan data pribadi Anda kepada pihak ketiga yang tidak berkepentingan tanpa izin Anda.

3. Keamanan Data
Kami menerapkan langkah-langkah keamanan teknis dan administratif yang wajar untuk melindungi data pribadi Anda dari akses yang tidak sah, kehilangan, atau pengungkapan.

4. Hak Pengguna
Anda berhak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda melalui menu pengaturan profil di aplikasi.`;

export const TERMS_TEXT = `Syarat dan Ketentuan Layanan LaporFasum:

1. Ketentuan Umum
Dengan mengakses dan menggunakan aplikasi LaporFasum, Anda menyetujui untuk terikat dengan syarat dan ketentuan yang berlaku. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan ini.

2. Akun Pengguna
Anda bertanggung jawab penuh atas kerahasiaan akun dan kata sandi Anda, serta semua aktivitas yang terjadi di bawah akun Anda.

3. Kewajiban Pelapor
Laporan yang Anda ajukan harus berdasarkan fakta yang sebenarnya, tidak mengandung unsur fitnah, ujaran kebencian, SARA, atau informasi palsu (hoax).

4. Penolakan dan Penghapusan Laporan
Pemerintah Kabupaten Lamongan berhak menolak, menyembunyikan, atau menghapus laporan yang dinilai melanggar ketentuan hukum atau norma yang berlaku.`;

export const MOCK_KECAMATAN = [
  { id: 1, nama: "Lamongan" },
  { id: 2, nama: "Sambirejo" },
  { id: 3, nama: "Mantup" },
  { id: 4, nama: "Sugio" },
  { id: 5, nama: "Glagah" },
  { id: 6, nama: "Modo" },
  { id: 7, nama: "Pucuk" },
  { id: 8, nama: "Paciran" }
];

export const MOCK_KATEGORI = [
  { id: 1, nama: "Jalan Rusak", prefix: "JLN" },
  { id: 2, nama: "Sampah Menumpuk", prefix: "SMP" },
  { id: 3, nama: "Lampu Jalan Mati", prefix: "LMP" },
  { id: 4, nama: "Drainase Tersumbat", prefix: "DRN" },
  { id: 5, nama: "Lainnya", prefix: "OTH" }
];

export const MOCK_HOME_STATS = [
  { label: "Total Laporan", value: "1.248" },
  { label: "Diproses", value: "142" },
  { label: "Selesai", value: "1.066" },
];

export const MOCK_WEEKLY_CHART = [
  { label: "Sen", value: 18 },
  { label: "Sel", value: 26 },
  { label: "Rab", value: 22 },
  { label: "Kam", value: 34 },
  { label: "Jum", value: 28 },
  { label: "Sab", value: 40 },
  { label: "Min", value: 32 },
];

export const MOCK_MONTHLY_CHART = [
  { label: "Minggu 1", value: 45 },
  { label: "Minggu 2", value: 62 },
  { label: "Minggu 3", value: 55 },
  { label: "Minggu 4", value: 78 },
];

export const MOCK_FACILITY_CATEGORIES = [
  { id: 1, nama: "Jalan dan Jembatan", icon: "jalan", color: "orange" },
  { id: 2, nama: "Penerangan Jalan Umum (PJU)", icon: "pju", color: "amber" },
  { id: 3, nama: "Saluran Air dan Drainase", icon: "drainase", color: "cyan" },
  { id: 4, nama: "Pengelolaan Sampah dan Kebersihan", icon: "taman", color: "emerald" },
  { id: 5, nama: "Taman dan Ruang Terbuka Hijau (RTH)", icon: "taman", color: "emerald" },
  { id: 6, nama: "Fasilitas Kesehatan", icon: "puskesmas", color: "blue" },
  { id: 7, nama: "Fasilitas Pendidikan", icon: "sekolah", color: "violet" },
  { id: 8, nama: "Rambu dan Marka Jalan", icon: "jalan", color: "orange" },
  { id: 9, nama: "Transportasi Publik (Halte, Terminal)", icon: "pju", color: "amber" },
  { id: 10, nama: "Fasilitas Olahraga dan Rekreasi", icon: "taman", color: "emerald" },
  { id: 11, nama: "Pasar Tradisional", icon: "puskesmas", color: "blue" },
  { id: 12, nama: "Tempat Ibadah", icon: "sekolah", color: "violet" },
];

export const DETAILED_FACILITY_DATA = {
  1: {
    id: 1,
    nama: "Jalan dan Jembatan",
    deskripsi: "Jalan dan jembatan adalah infrastruktur transportasi vital yang menghubungkan berbagai wilayah di Kabupaten Lamongan, memfasilitasi mobilitas penduduk dan distribusi barang.",
    sejarah: "Infrastruktur jalan di Lamongan telah berkembang sejak era kolonial dengan pembangunan jalan penghubung antar desa. Perkembangan signifikan terjadi pasca-kemerdekaan, terutama sejak 1970-an dengan program perbaikan jalan nasional dan provincial.",
    kondisi: "Baik",
    jumlahUnit: "156 km jalan dan 8 jembatan utama",
    thumbnail: "https://images.unsplash.com/photo-1488747807830-63789f68bb65?auto=format&fit=crop&q=80&w=600",
    color: "orange",
    fasilitas: [
      { id: 1, nama: "Jl. Raya Lamongan - Sambirejo", lokasi: "Menghubungkan Lamongan ke Sambirejo", kecamatan: "Lamongan-Sambirejo", latitude: -6.9040, longitude: 112.2500, kondisi: "Baik" },
      { id: 2, nama: "Jl. Desa Mantup - Sugio", lokasi: "Penghubung antar desa", kecamatan: "Mantup-Sugio", latitude: -6.9165, longitude: 112.2545, kondisi: "Baik" },
      { id: 3, nama: "Jl. Raya Glagah", lokasi: "Jalan utama Kecamatan Glagah", kecamatan: "Glagah", latitude: -7.0234, longitude: 112.2567, kondisi: "Baik" },
      { id: 4, nama: "Jembatan Sungai Bengawan", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
    ]
  },
  2: {
    id: 2,
    nama: "Penerangan Jalan Umum (PJU)",
    deskripsi: "Penerangan Jalan Umum (PJU) adalah sistem pencahayaan di jalan-jalan umum yang bertujuan meningkatkan keamanan, kenyamanan, dan visibilitas pengguna jalan pada malam hari.",
    sejarah: "Program PJU di Lamongan dimulai pada 1980-an dengan pemasangan lampu merkuri tradisional. Sejak 2010-an, telah digantikan secara bertahap dengan lampu LED yang lebih hemat energi dan ramah lingkungan.",
    kondisi: "Baik",
    jumlahUnit: "2.340 titik lampu jalan",
    thumbnail: "https://images.unsplash.com/photo-1584367694821-e571dc86c495?auto=format&fit=crop&q=80&w=600",
    color: "amber",
    fasilitas: [
      { id: 1, nama: "PJU Jl. Raya Lamongan", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "PJU Jl. Ahmad Yani", lokasi: "Jl. Ahmad Yani", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 3, nama: "PJU Jl. Pendidikan Sambirejo", lokasi: "Jl. Pendidikan", kecamatan: "Sambirejo", latitude: -6.9126, longitude: 112.2843, kondisi: "Baik" },
      { id: 4, nama: "PJU Jl. Merdeka Mantup", lokasi: "Jl. Merdeka", kecamatan: "Mantup", latitude: -6.9876, longitude: 112.3143, kondisi: "Baik" },
    ]
  },
  3: {
    id: 3,
    nama: "Saluran Air dan Drainase",
    deskripsi: "Saluran air dan drainase adalah infrastruktur pengaliran air yang berfungsi mencegah genangan air, banjir, dan menjaga sistem pengairan di area perkotaan dan pedesaan Lamongan.",
    sejarah: "Sistem drainase modern di Lamongan mulai dibangun pada 1990-an sebagai respons terhadap masalah banjir. Perkembangan berkelanjutan terus dilakukan untuk mengantisipasi perubahan iklim dan intensitas hujan.",
    kondisi: "Baik",
    jumlahUnit: "89 km saluran drainase",
    thumbnail: "https://images.unsplash.com/photo-1581092163562-40038e57e0bc?auto=format&fit=crop&q=80&w=600",
    color: "cyan",
    fasilitas: [
      { id: 1, nama: "Drainase Jl. Raya Lamongan", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Drainase Jl. Ahmad Yani", lokasi: "Jl. Ahmad Yani", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 3, nama: "Drainase Kampung Sambirejo", lokasi: "Kampung Sambirejo", kecamatan: "Sambirejo", latitude: -6.9126, longitude: 112.2843, kondisi: "Baik" },
      { id: 4, nama: "Drainase Jl. Merdeka Mantup", lokasi: "Jl. Merdeka", kecamatan: "Mantup", latitude: -6.9876, longitude: 112.3143, kondisi: "Baik" },
    ]
  },
  4: {
    id: 4,
    nama: "Pengelolaan Sampah dan Kebersihan",
    deskripsi: "Pengelolaan sampah dan kebersihan adalah sistem penanganan limbah dan pemeliharaan kebersihan lingkungan untuk menjaga kesehatan masyarakat dan kualitas lingkungan Kabupaten Lamongan.",
    sejarah: "Program pengelolaan sampah di Lamongan berkembang sejak 2000-an dengan pembangunan tempat pembuangan akhir (TPA) dan sistem pengumpulan sampah terpadu. Saat ini fokus pada peningkatan kesadaran masyarakat tentang kebersihan lingkungan.",
    kondisi: "Baik",
    jumlahUnit: "27 titik tempat sampah publik dan 4 TPA regional",
    thumbnail: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600",
    color: "emerald",
    fasilitas: [
      { id: 1, nama: "TPA Lamongan Utama", lokasi: "Jl. Pengelolaan Lingkungan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Tempat Sampah Jl. Raya", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 3, nama: "TPA Sambirejo", lokasi: "Jl. Pengelolaan", kecamatan: "Sambirejo", latitude: -6.9126, longitude: 112.2843, kondisi: "Baik" },
    ]
  },
  5: {
    id: 5,
    nama: "Taman dan Ruang Terbuka Hijau (RTH)",
    deskripsi: "Taman dan Ruang Terbuka Hijau (RTH) adalah ruang publik yang berfungsi sebagai tempat rekreasi, pelestarian lingkungan, dan meningkatkan kualitas udara di kawasan urban Lamongan.",
    sejarah: "Pengembangan taman kota di Lamongan dimulai pada 2000-an sebagai bagian dari program penghijauan dan pengembangan kawasan hijau. Tujuannya menciptakan ruang terbuka hijau yang ramah lingkungan dan aksesibel bagi seluruh masyarakat.",
    kondisi: "Baik",
    jumlahUnit: "8 taman kota utama dan 15 ruang hijau publik",
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600",
    color: "emerald",
    fasilitas: [
      { id: 1, nama: "Taman Kota Lamongan", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Taman Pucuk", lokasi: "Desa Pucuk", kecamatan: "Pucuk", latitude: -7.0123, longitude: 112.2890, kondisi: "Baik" },
      { id: 3, nama: "Taman Pantai Paciran", lokasi: "Jl. Pantai Paciran", kecamatan: "Paciran", latitude: -6.7890, longitude: 112.3210, kondisi: "Baik" },
      { id: 4, nama: "Taman Edukasi Lingkungan", lokasi: "Jl. Pendidikan", kecamatan: "Lamongan", latitude: -6.8960, longitude: 112.2180, kondisi: "Baik" },
    ]
  },
  6: {
    id: 6,
    nama: "Fasilitas Kesehatan",
    deskripsi: "Fasilitas kesehatan adalah institusi pelayanan kesehatan yang menyediakan layanan kesehatan dasar, rujukan, dan perawatan kesehatan masyarakat di Kabupaten Lamongan.",
    sejarah: "Fasilitas kesehatan di Lamongan mulai berkembang sejak tahun 1970-an dengan pembangunan Puskesmas di berbagai kecamatan. Sejak 2000-an, telah dikembangkan sistem kesehatan terpadu dengan rumah sakit rujukan dan klinik spesialistik.",
    kondisi: "Baik",
    jumlahUnit: "12 Puskesmas, 2 Rumah Sakit, dan 25 Klinik",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&q=80&w=600",
    color: "blue",
    fasilitas: [
      { id: 1, nama: "Puskesmas Lamongan", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Puskesmas Sambirejo", lokasi: "Jl. Pendidikan No. 5", kecamatan: "Sambirejo", latitude: -6.9126, longitude: 112.2843, kondisi: "Baik" },
      { id: 3, nama: "Rumah Sakit Umum Lamongan", lokasi: "Jl. Jend. Sudirman", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 4, nama: "Puskesmas Mantup", lokasi: "Jl. Merdeka", kecamatan: "Mantup", latitude: -6.9876, longitude: 112.3143, kondisi: "Baik" },
    ]
  },
  7: {
    id: 7,
    nama: "Fasilitas Pendidikan",
    deskripsi: "Fasilitas pendidikan adalah institusi pembelajaran yang menyediakan layanan pendidikan formal untuk tingkat Sekolah Dasar (SD), Sekolah Menengah Pertama (SMP), dan Sekolah Menengah Atas (SMA).",
    sejarah: "Sistem pendidikan di Lamongan telah berkembang sejak era kolonial dengan pembangunan sekolah-sekolah dasar. Pasca-kemerdekaan, infrastruktur pendidikan diperkuat dengan pembangunan SMP dan SMA di berbagai kecamatan untuk memberikan akses pendidikan kepada semua lapisan masyarakat.",
    kondisi: "Baik",
    jumlahUnit: "47 unit Sekolah (20 SD, 15 SMP, 12 SMA) dan 5 Pesantren",
    thumbnail: "https://images.unsplash.com/photo-1427504494785-cdec0f96fa88?auto=format&fit=crop&q=80&w=600",
    color: "violet",
    fasilitas: [
      { id: 1, nama: "SDN Lamongan 1", lokasi: "Jl. Diponegoro No. 10", kecamatan: "Lamongan", latitude: -6.8945, longitude: 112.2165, kondisi: "Baik" },
      { id: 2, nama: "SMP Negeri 1 Lamongan", lokasi: "Jl. Ahmad Yani", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 3, nama: "SMA Negeri 1 Lamongan", lokasi: "Jl. Jend. Sudirman", kecamatan: "Lamongan", latitude: -6.8960, longitude: 112.2180, kondisi: "Baik" },
      { id: 4, nama: "SDN Sambirejo 2", lokasi: "Jl. Pendidikan", kecamatan: "Sambirejo", latitude: -6.9130, longitude: 112.2850, kondisi: "Baik" },
    ]
  },
  8: {
    id: 8,
    nama: "Rambu dan Marka Jalan",
    deskripsi: "Rambu dan marka jalan adalah peralatan penunjuk arah, peringatan, dan penanda di jalan untuk meningkatkan keselamatan dan mengatur lalu lintas di Kabupaten Lamongan.",
    sejarah: "Sistem rambu dan marka jalan di Indonesia dimulai mengikuti standar internasional sejak 1960-an. Peningkatan berkelanjutan terjadi sejalan dengan pertumbuhan volume lalu lintas dan kesadaran keselamatan jalan raya.",
    kondisi: "Baik",
    jumlahUnit: "340 rambu jalan dan 89 km marka jalan",
    thumbnail: "https://images.unsplash.com/photo-1488747807830-63789f68bb65?auto=format&fit=crop&q=80&w=600",
    color: "orange",
    fasilitas: [
      { id: 1, nama: "Rambu Jl. Raya Lamongan", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Marka Jl. Ahmad Yani", lokasi: "Jl. Ahmad Yani", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 3, nama: "Rambu Persimpangan Mantup", lokasi: "Persimpangan Jl. Merdeka", kecamatan: "Mantup", latitude: -6.9876, longitude: 112.3143, kondisi: "Baik" },
    ]
  },
  9: {
    id: 9,
    nama: "Transportasi Publik (Halte, Terminal)",
    deskripsi: "Transportasi publik termasuk halte bus dan terminal adalah fasilitas transportasi yang melayani mobilitas masyarakat melalui layanan angkutan umum di Kabupaten Lamongan.",
    sejarah: "Sistem transportasi publik di Lamongan berkembang sejak 1980-an dengan pembangunan terminal bus pusat dan halte-halte di berbagai lokasi strategis. Perkembangan terus dilakukan untuk meningkatkan aksesibilitas dan kenyamanan pengguna.",
    kondisi: "Baik",
    jumlahUnit: "4 terminal dan 42 halte bus",
    thumbnail: "https://images.unsplash.com/photo-1488747807830-63789f68bb65?auto=format&fit=crop&q=80&w=600",
    color: "amber",
    fasilitas: [
      { id: 1, nama: "Terminal Lamongan Pusat", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Halte Jl. Ahmad Yani", lokasi: "Jl. Ahmad Yani", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 3, nama: "Halte Sambirejo", lokasi: "Jl. Pendidikan", kecamatan: "Sambirejo", latitude: -6.9126, longitude: 112.2843, kondisi: "Baik" },
      { id: 4, nama: "Terminal Mantup", lokasi: "Jl. Merdeka", kecamatan: "Mantup", latitude: -6.9876, longitude: 112.3143, kondisi: "Baik" },
    ]
  },
  10: {
    id: 10,
    nama: "Fasilitas Olahraga dan Rekreasi",
    deskripsi: "Fasilitas olahraga dan rekreasi adalah sarana publik yang mendukung aktivitas olahraga dan rekreasi masyarakat untuk meningkatkan kesehatan dan kualitas hidup di Kabupaten Lamongan.",
    sejarah: "Pengembangan fasilitas olahraga di Lamongan dimulai pada 1990-an dengan pembangunan lapangan olahraga dan kolam renang publik. Perkembangan terus dilakukan untuk menyediakan fasilitas olahraga berkualitas yang terjangkau bagi masyarakat.",
    kondisi: "Baik",
    jumlahUnit: "5 lapangan olahraga, 3 kolam renang, dan 12 area bermain",
    thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600",
    color: "emerald",
    fasilitas: [
      { id: 1, nama: "Lapangan Olahraga Lamongan", lokasi: "Jl. Olahraga", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Kolam Renang Umum", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 3, nama: "Lapangan Voli Sambirejo", lokasi: "Jl. Pendidikan", kecamatan: "Sambirejo", latitude: -6.9126, longitude: 112.2843, kondisi: "Baik" },
    ]
  },
  11: {
    id: 11,
    nama: "Pasar Tradisional",
    deskripsi: "Pasar tradisional adalah pusat perdagangan yang menyediakan berbagai kebutuhan pokok masyarakat dan menjadi pusat aktivitas ekonomi di tingkat grassroot Kabupaten Lamongan.",
    sejarah: "Pasar tradisional di Lamongan telah berkembang selama berabad-abad sebagai pusat pertukaran barang dan jasa. Pasar-pasar utama terus dipertahankan dan dikembangkan untuk mendukung ekonomi lokal dan memberikan ruang bagi pedagang tradisional.",
    kondisi: "Baik",
    jumlahUnit: "7 pasar tradisional utama",
    thumbnail: "https://images.unsplash.com/photo-1488747807830-63789f68bb65?auto=format&fit=crop&q=80&w=600",
    color: "blue",
    fasilitas: [
      { id: 1, nama: "Pasar Lamongan Pusat", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Pasar Tradisional Sambirejo", lokasi: "Jl. Pendidikan", kecamatan: "Sambirejo", latitude: -6.9126, longitude: 112.2843, kondisi: "Baik" },
      { id: 3, nama: "Pasar Mantup", lokasi: "Jl. Merdeka", kecamatan: "Mantup", latitude: -6.9876, longitude: 112.3143, kondisi: "Baik" },
    ]
  },
  12: {
    id: 12,
    nama: "Tempat Ibadah",
    deskripsi: "Tempat ibadah adalah fasilitas keagamaan yang menyediakan ruang bagi masyarakat untuk melakukan aktivitas spiritual dan keagamaan sesuai dengan keyakinan mereka di Kabupaten Lamongan.",
    sejarah: "Tempat ibadah di Lamongan tersebar di berbagai lokasi sesuai dengan distribusi penduduk dan keberagaman agama yang dianut oleh masyarakat. Pembangunan dan pemeliharaan tempat ibadah didukung oleh komunitas lokal dan pemerintah.",
    kondisi: "Baik",
    jumlahUnit: "156 Masjid, 32 Gereja, 8 Vihara, dan 5 Pura",
    thumbnail: "https://images.unsplash.com/photo-1520763185298-1b434c919abe?auto=format&fit=crop&q=80&w=600",
    color: "violet",
    fasilitas: [
      { id: 1, nama: "Masjid Al-Qodiri", lokasi: "Jl. Raya Lamongan", kecamatan: "Lamongan", latitude: -6.8938, longitude: 112.2140, kondisi: "Baik" },
      { id: 2, nama: "Gereja Kristen Lamongan", lokasi: "Jl. Ahmad Yani", kecamatan: "Lamongan", latitude: -6.8950, longitude: 112.2170, kondisi: "Baik" },
      { id: 3, nama: "Masjid Nurul Hidayah", lokasi: "Jl. Pendidikan", kecamatan: "Sambirejo", latitude: -6.9126, longitude: 112.2843, kondisi: "Baik" },
      { id: 4, nama: "Vihara Gatama Bodhi", lokasi: "Jl. Merdeka", kecamatan: "Mantup", latitude: -6.9876, longitude: 112.3143, kondisi: "Baik" },
    ]
  }
};

export const INITIAL_REPORTS = [
  {
    id: 1,
    ticket_code: "LMG-JLN-001",
    judul: "Jalan Berlubang Besar di Jl. Raya Lamongan",
    kategori: "Jalan dan Jembatan",
    kecamatan: "Lamongan",
    deskripsi: "Lubang cukup dalam sekitar 30cm, membahayakan pengendara motor.",
    latitude: -6.8938,
    longitude: 112.2140,
    status: "Menunggu Verifikasi",
    tanggal: "2026-08-28 10:00:00",
    pelapor: "Budi Santoso",
    foto: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    ticket_code: "LMG-SMP-002",
    judul: "Sampah Liar di Pinggir Jalan Sambirejo",
    kategori: "Pengelolaan Sampah dan Kebersihan",
    kecamatan: "Sambirejo",
    deskripsi: "Tumpukan sampah warga membuat bau menyengat dan menyumbat aliran air.",
    latitude: -6.9126,
    longitude: 112.2843,
    status: "Diterima",
    tanggal: "2026-08-27 14:30:00",
    pelapor: "Siti Aminah",
    foto: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    ticket_code: "LMG-LMP-003",
    judul: "Lampu Penerangan Jalan Padam Total",
    kategori: "Penerangan Jalan Umum (PJU)",
    kecamatan: "Mantup",
    deskripsi: "Sudah 3 malam lampu jalan mati total di sepanjang blok M.",
    latitude: -6.9876,
    longitude: 112.3143,
    status: "Selesai",
    tanggal: "2026-08-25 09:15:00",
    pelapor: "Ahmad Dani",
    foto: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    ticket_code: "LMG-DRN-004",
    judul: "Saluran Air Tersumbat di Sugio",
    kategori: "Saluran Air dan Drainase",
    kecamatan: "Sugio",
    deskripsi: "Saluran mampet karena lumpur dan dedaunan kering, air meluber ke jalan saat hujan.",
    latitude: -6.8450,
    longitude: 112.1950,
    status: "Menunggu Verifikasi",
    tanggal: "2026-08-24 11:20:00",
    pelapor: "Dewi Lestari",
    foto: "https://images.unsplash.com/photo-1581092163562-40038e57e0bc?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    ticket_code: "LMG-RTH-005",
    judul: "Fasilitas Bermain Anak Rusak di Taman Kota",
    kategori: "Taman dan Ruang Terbuka Hijau (RTH)",
    kecamatan: "Lamongan",
    deskripsi: "Papan seluncuran patah di bagian sambungan, berbahaya untuk anak-anak.",
    latitude: -6.8938,
    longitude: 112.2140,
    status: "Diterima",
    tanggal: "2026-08-23 16:45:00",
    pelapor: "Rian Hidayat",
    foto: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 6,
    ticket_code: "LMG-EDU-006",
    judul: "Pagar Sekolah SDN Lamongan 1 Miring",
    kategori: "Fasilitas Pendidikan",
    kecamatan: "Lamongan",
    deskripsi: "Pagar depan hampir roboh setelah tertabrak kendaraan minggu lalu.",
    latitude: -6.8945,
    longitude: 112.2165,
    status: "Selesai",
    tanggal: "2026-08-20 08:30:00",
    pelapor: "Hendra Wijaya",
    foto: "https://images.unsplash.com/photo-1427504494785-cdec0f96fa88?auto=format&fit=crop&q=80&w=600"
  }
];
