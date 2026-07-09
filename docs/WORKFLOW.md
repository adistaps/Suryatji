# WORKFLOW - Suryatji Coffee

## Fase Pengembangan (rekomendasi)

### Fase 1 - Setup & Foundation
- Setup project React VIte + Supabase + Tailwind/shadcn
- Buat skema database (lihat DATABASE.md) + migrasi
- Setup Supabase Storage buckets (product-images, payment-proofs, qris)

### Fase 2 - Public Site (Core Shop)
- Home, About Us, Our Store, Contact Us (static/CMS-light)
- Shop page + filter/search
- Product detail + varian selector
- Cart (localStorage-based)

### Fase 3 - Checkout & Payment Flow
- Checkout form + integrasi Komerce API (cek ongkir)
- Halaman pembayaran (QRIS + rekening bank)
- Upload bukti bayar
- Generate link WA konfirmasi

### Fase 4 - Admin Panel
- Auth admin (Supabase Auth)
- CRUD produk & varian
- Manajemen order (list, detail, ubah status)
- Laporan penjualan + Cashflow (pemasukan otomatis + pengeluaran manual)
- Dashboard monitoring (ringkasan omzet, grafik)

### Fase 5 - QA & Launch
- Testing end-to-end flow checkout (mobile & desktop)
- Testing upload file (edge case: file besar, format salah)
- Review konten (foto produk, copy About Us/Our Store)
- Deploy production + domain

## Status Order (State Machine)
```
pending → waiting_confirmation → paid → shipped → completed
                                      ↘ cancelled (dari status manapun sebelum shipped)
```

## Checklist Sebelum Launch
- [ ] Semua rekening bank & QRIS aktif sudah diinput admin
- [ ] Nomor WA admin sudah benar di env var
- [ ] Komerce API key aktif & tervalidasi
- [ ] Minimal 1 kategori & beberapa produk dengan varian lengkap sudah diinput
- [ ] Test checkout end-to-end dari sisi customer (device HP asli)
- [ ] Test upload bukti bayar & lihat di admin
