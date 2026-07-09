# PRD - Suryatji Coffee E-Commerce Website

## 1. Ringkasan Proyek

**Nama Bisnis:** Suryatji Coffee (Farm & Roastery)
**Pemilik:** Saryadi Suryatji
**Lokasi:** Jl Parakan - Wonosobo Km.11, Kledung, Temanggung, Jawa Tengah
**Kontak:** 081229888033 | saryadisuryatji@gmail.com | IG: @suryadisuryatji_coffee

Website e-commerce untuk penjualan biji kopi & bubuk kopi (green bean, roasted, whole bean, hasil grind dengan berbagai tingkat kehalusan), terinspirasi dari struktur & desain template Kaffa, dengan sistem checkout tanpa login dan pembayaran manual terverifikasi via WhatsApp.

## 2. Tujuan Produk

- Memberi kanal penjualan online resmi untuk Suryatji Coffee
- Mempermudah customer membeli kopi tanpa perlu registrasi akun (guest checkout)
- Otomatisasi cek ongkir real-time
- Mempercepat proses konfirmasi pembayaran via WhatsApp
- Memberi pemilik bisnis dashboard untuk monitoring penjualan & cashflow

## 3. Target Pengguna

| Peran | Deskripsi |
|---|---|
| **Customer (Guest)** | Pembeli umum, tidak perlu akun, checkout dengan isi form manual |
| **Admin (Owner)** | Saryadi Suryatji - mengelola produk, pesanan, laporan, cashflow |

## 4. Struktur Halaman (Public Site)

1. **Home** - Hero section ("Rich Taste, Great Aroma" style), highlight produk, tentang singkat, testimoni
2. **About Us** - Cerita brand, sejarah farm, proses roasting
3. **Our Store** - Profil cafe/toko fisik Suryatji Coffee (desain mengambil referensi hero image Kaffa)
4. **Shop** - Katalog produk, filter kategori, filter harga, search
5. **Product Detail** - Detail produk, pilih varian (berat + grind type), add to cart
6. **Cart** - Review item, ubah qty, hapus item
7. **Checkout** - Form data diri, cek ongkir, pilih metode bayar, upload bukti transfer
8. **Contact Us** - Info kontak, lokasi (maps embed), form pesan

## 5. Fitur Utama

### 5.1 Katalog & Produk
- Produk memiliki varian: **Berat** (250g / 500g / 1kg) × **Grind Type** (Whole Bean, Coarse, Medium, Fine, Espresso)
- Setiap kombinasi varian punya harga, stok, dan SKU sendiri
- Kategori produk (Arabica, Robusta, Blend, dll)
- Search & filter (kategori, harga, ketersediaan stok)

### 5.2 Cart & Checkout (Tanpa Login)
- Add to cart multi-produk & multi-varian (session/local state, tidak perlu akun)
- Checkout wajib isi: Nama, No. HP/WA, Alamat lengkap, Provinsi/Kota/Kecamatan
- **Cek ongkir otomatis** via API Komerce (real-time berdasarkan alamat tujuan & berat total)
- Ringkasan order sebelum submit

### 5.3 Pembayaran Manual
- Pilihan: **1 QRIS statis** + **beberapa rekening bank**
- Setelah checkout, tampilkan halaman instruksi pembayaran dengan nominal & metode yang dipilih
- Tombol **"Attach Bukti Pembayaran"** - upload gambar bukti transfer (disimpan ke Supabase Storage)
- Tombol **"Konfirmasi via WhatsApp"** - generate link `wa.me` dengan pesan pre-filled berisi ringkasan order (produk, qty, total, no. order) yang dikirim ke nomor WA admin
- Status order otomatis: `pending` → `waiting_confirmation` (setelah upload bukti) → `paid` (dikonfirmasi admin manual) → `shipped` → `completed`

### 5.4 Admin Dashboard
- **CRUD Produk**: tambah/edit/hapus produk & varian, upload foto, atur stok
- **Manajemen Pesanan**: lihat daftar order, detail order, ubah status, lihat bukti bayar
- **Laporan Penjualan**: filter by tanggal/produk, export (opsional)
- **Cashflow**: catat pemasukan (otomatis dari order `paid`) + input pengeluaran manual (operasional, bahan baku, dll), saldo berjalan
- **Dashboard Monitoring**: ringkasan omzet, order pending, produk terlaris, grafik penjualan

## 6. Non-Functional Requirements

- Mobile-first & responsive (mayoritas customer akan akses via HP/WA)
- Guest checkout wajib cepat (minim friction, max 1 halaman form)
- Upload bukti bayar harus validasi ukuran & format file (jpg/png/pdf, maks 5MB)
- Admin panel wajib login (auth terpisah dari customer flow)

## 7. Out of Scope (v1)

- Payment gateway otomatis (Midtrans/Xendit) - masih manual dulu
- WA Business API otomatis - masih pakai link wa.me manual
- Multi-admin/role permission granular
- Program loyalti/membership customer

## 8. Referensi Desain

- Template dasar: Kaffa (Envato) - home hero, product grid, shop page, product detail, contact page
- Hero "Our Store" mengadaptasi hero "Rich Taste, Great Aroma" dari referensi yang diberikan
