# LibraryReg - Aplikasi Pendaftaran Anggota Perpustakaan

Aplikasi web front-end modern untuk pendaftaran anggota dan manajemen data perpustakaan perguruan tinggi secara digital. Dibangun menggunakan **HTML5, CSS3 kustom, Bootstrap 5.3, Vanilla JavaScript, dan LocalStorage**.

---

## 🌟 Fitur Utama
1. **Landing Page Responsif**:
   - Header & navigasi dengan penanda menu aktif.
   - Hero section dengan banner *"Gerbang Ilmu Menuju Masa Depan"*, tombol ajakan (*Call to Action*), dan foto interior perpustakaan.
   - 4 Kartu keunggulan: Koleksi Lengkap, Akses untuk Semua, Layanan Digital, dan Ruang Nyaman.
   - Statistik interaktif koleksi dan jumlah anggota.
   - Section Tentang Perpustakaan, Layanan Unggulan, dan Footer lengkap (kontak & jam layanan).
   - Modal simulasi login petugas dengan fitur *Auto-fill Demo*.

2. **Formulir Pendaftaran Online (`pendaftaran.html`)**:
   - Breadcrumb navigasi.
   - Kartu panduan benefit anggota + ilustrasi karakter.
   - Validasi formulir lengkap:
     - Nama Lengkap, Alamat, dan Program Studi (Wajib).
     - Validasi keunikan NIM/NIP (mencegah duplikasi data).
     - Validasi format Email dan Nomor Telepon.
   - Penerbitan otomatis **Kartu Anggota Digital** interaktif dengan opsi cetak (*Print*).

3. **Halaman Pengelolaan Data Anggota (`data-anggota.html`)**:
   - Layout dashboard admin dengan sidebar terstruktur.
   - Tabel responsif berisi data anggota lengkap dengan avatar.
   - Pencarian real-time (berdasarkan nama, NIM/NIP, prodi, atau email).
   - Multi-filter berdasarkan *Jenis Keanggotaan* (Mahasiswa, Dosen, Tenaga Kependidikan) dan *Program Studi*.
   - Fitur CRUD lengkap (Tambah anggota baru, Lihat detail kartu anggota, Edit data, dan Hapus data dengan dialog konfirmasi).
   - Notifikasi Toast modern dan paginasi otomatis.
   - Penyimpanan persisten ke `localStorage` browser.

---

## 📁 Struktur Direktori
```text
libraryreg/
├── index.html            # Landing page utama
├── pendaftaran.html      # Formulir pendaftaran anggota online
├── data-anggota.html     # Dashboard pengelolaan data anggota untuk petugas
├── css/
│   └── style.css         # Styling kustom & penyempurnaan Bootstrap
├── js/
│   ├── data.js           # Manajemen state localStorage & data dummy awal
│   └── app.js            # Controller interaktivitas, validasi form, dan CRUD
└── README.md             # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Aplikasi
1. **Buka Langsung di Browser**:
   - Buka folder `C:\Users\HP\.gemini\antigravity\scratch\libraryreg`.
   - Klik dua kali file `index.html` pada browser apa pun (Google Chrome, Edge, Firefox).

2. **Menggunakan Local Server (Opsional)**:
   - Jalankan terminal di folder proyek:
     ```bash
     python -m http.server 8000
     ```
   - Buka browser pada alamat: `http://localhost:8000`
