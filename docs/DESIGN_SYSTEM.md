# DESIGN SYSTEM - Suryatji Coffee

## Referensi Visual
Adaptasi dari template Kaffa dengan tone lebih earthy/farm-to-cup, mengangkat identitas lokal Kledung, Temanggung.

## Palet Warna
| Nama | Hex | Penggunaan |
|---|---|---|
| Coffee Green (primary) | #4A7C3A / sesuaikan brand | CTA button, aksen |
| Dark Roast | #1E1A17 | Hero background, footer |
| Cream | #F5EFE6 | Section background |
| Kraft Brown | #8B6F4E | Aksen sekunder, border |
| White | #FFFFFF | Text di atas dark bg |

## Tipografi
- **Heading:** Serif atau display font tebal (kesan premium, mirip "Kaffa" wordmark)
- **Body:** Sans-serif clean (Inter/Poppins) untuk keterbacaan mobile

## Komponen Kunci (mengacu ke referensi Kaffa)
1. **Hero Home** - full-width image gelap + headline besar + CTA "Belanja Sekarang", mirip "Rich Taste, Great Aroma"
2. **Hero Our Store** - reuse gaya hero yang sama, isi profil toko fisik
3. **Product Card** - foto produk kraft-paper style, rating, harga, quick "Add to Cart"
4. **Category Icons** - grid ikon kategori (Arabica, Robusta, Blend) ala "Tasty Products" Kaffa
5. **Shop Page** - sidebar filter (kategori, harga) + grid produk 3 kolom, pagination
6. **Product Detail** - galeri gambar kiri, info + varian selector (dropdown Berat, dropdown Grind Type) + qty + Add to Cart kanan
7. **Checkout Form** - single-column mobile-first, section: Data Diri → Alamat → Cek Ongkir → Metode Bayar → Upload Bukti
8. **Contact Page** - info card (lokasi, telepon, email, jam buka) + embed Google Maps ke lokasi Suryatji Coffee + form pesan

## Prinsip UX
- Mobile-first (checkout harus nyaman 1 tangan di HP)
- Minim klik untuk guest checkout (idealnya 1 halaman form)
- Status order jelas & real-time feedback setelah upload bukti bayar
- CTA WhatsApp selalu terlihat (floating button opsional)
