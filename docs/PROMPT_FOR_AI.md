# PROMPT: Build Suryatji Coffee E-Commerce Website

Kamu adalah fullstack developer AI. Tugasmu membangun website e-commerce untuk **Suryatji Coffee** dengan mereplikasi desain dari referensi yang dilampirkan **100% identik secara visual** (layout, spacing, komponen, animasi, struktur halaman) — hanya konten/data yang diganti sesuai brand Suryatji Coffee. Jangan mendesain ulang dari nol, jangan menyederhanakan komponen yang ada di referensi.

## Dokumen Referensi yang Dilampirkan
Baca dan ikuti seluruh dokumen berikut sebagai sumber kebenaran untuk requirement, skema database, arsitektur, dan alur kerja:
1. `PRD.md` - requirement produk & fitur lengkap
2. `DATABASE.md` - skema database Supabase (wajib diikuti persis, termasuk nama tabel & kolom)
3. `ARCHITECTURE.md` - tech stack, struktur folder, alur data, integrasi API
4. `DESIGN_SYSTEM.md` - palet warna, tipografi, komponen kunci
5. `WORKFLOW.md` - urutan fase pengembangan

Selain itu terlampir juga **screenshot referensi desain** (template Kaffa): Home page, Shop/All Products page, Product Detail page, Contact page, dan referensi hero "Rich Taste, Great Aroma" untuk halaman Our Store.

## Instruksi Utama

### 1. Kloning Desain 100%
- Replikasi **layout, grid, spacing, ukuran komponen, jenis animasi/transisi, style tombol, style card produk, footer, header/navbar** persis seperti pada screenshot referensi.
- Jangan mengubah struktur visual — hanya ganti:
  - Nama brand "Kaffa" → **"Suryatji Coffee"**
  - Warna tema mengikuti `DESIGN_SYSTEM.md` (tetap pertahankan struktur komponen yang sama, hanya palet warna yang disesuaikan)
  - Semua teks placeholder/lorem ipsum → konten asli Suryatji Coffee (lihat bagian Data Brand di bawah)
  - Semua foto produk kopi generik → gunakan placeholder foto kopi yang related (nanti akan diganti foto asli oleh owner)
  - Halaman "Our Store" dibuat dengan hero section bergaya sama seperti hero "Rich Taste, Great Aroma" pada referensi, tapi isi konten profil cafe/toko fisik Suryatji Coffee

### 2. Struktur Halaman (wajib sama persis dengan PRD.md)
Home → About Us → Our Store → Shop → Product Detail → Cart → Checkout → Checkout Success → Contact Us
Plus Admin Panel: Login, Dashboard, Products (CRUD), Orders, Reports, Cashflow

### 3. Tech Stack (ikuti ARCHITECTURE.md persis)
React Vite, Tailwind CSS + shadcn/ui, Framer Motion, Supabase (DB + Auth + Storage), Komerce API untuk ongkir.

### 4. Data Brand Suryatji Coffee (gunakan ini untuk mengganti semua konten placeholder)
- **Nama:** Suryatji Coffee (Farm & Roastery)
- **Owner:** Saryadi Suryatji
- **Alamat:** Jl. Parakan - Wonosobo Km.11, Kledung, Temanggung, Jawa Tengah
- **Telepon/WA:** 0812-2988-8033
- **Email:** saryadisuryatji@gmail.com
- **Instagram:** @suryadisuryatji_coffee
- **Lokasi Google Maps:** https://maps.app.goo.gl/pr46KDWRbovCkD5g9
- **Deskripsi singkat brand:** Farm & roastery kopi lokal dari kaki Gunung Sindoro, Kledung — Temanggung. Menjual biji kopi (green bean, roasted, whole bean) dan bubuk kopi hasil grind dengan berbagai tingkat kehalusan, hasil panen dan olahan sendiri.

### 5. Fitur Fungsional Wajib (detail lengkap ada di PRD.md — implementasikan semua)
- Varian produk: Berat (250g/500g/1kg) × Grind Type (Whole Bean/Coarse/Medium/Fine/Espresso)
- Cart & checkout **tanpa login** (guest checkout)
- Cek ongkir otomatis via Komerce API
- Pembayaran manual: 1 QRIS + beberapa rekening bank (data dummy dulu, nanti diisi admin)
- Upload bukti transfer (gambar/pdf, maks 5MB)
- Tombol konfirmasi via WhatsApp — generate link `wa.me` dengan pesan pre-filled (nomor tujuan: 081229888033)
- Admin dashboard: CRUD produk & varian, manajemen order, laporan penjualan, cashflow (pemasukan otomatis + input pengeluaran manual), dashboard monitoring

### 6. Urutan Kerja
Ikuti fase di `WORKFLOW.md`:
1. Setup project + skema database sesuai `DATABASE.md`
2. Bangun public site (Home, About Us, Our Store, Shop, Product Detail, Cart)
3. Checkout & payment flow + integrasi ongkir + upload bukti + WA link
4. Admin panel lengkap
5. QA end-to-end sebelum selesai

## Output yang Diharapkan
Kode lengkap projectReact Vitesiap dijalankan (`npm install && npm run dev`), dengan struktur folder sesuai `ARCHITECTURE.md`, database schema/migration sesuai `DATABASE.md`, dan tampilan visual yang **secara langsung bisa dibandingkan berdampingan dengan screenshot referensi dan terlihat identik**, hanya beda data/brand.

Jika ada bagian di screenshot referensi yang ambigu atau tidak tercakup di dokumen, ambil keputusan yang paling konsisten dengan gaya visual Kaffa dan catat asumsi tersebut di akhir sebagai daftar singkat.
