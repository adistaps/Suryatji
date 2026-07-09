# ARCHITECTURE - Suryatji Coffee

## Tech Stack

| Layer | Teknologi |
|---|---|
| Library / Build Tool | React (Vite) + TypeScript |
| Routing | react-router-dom (Client-side routing) |
| Styling | Tailwind CSS + shadcn/ui |
| Animasi | Framer Motion / CSS Transitions |
| Database & Auth | Supabase (Postgres + Supabase Auth untuk admin) |
| Storage | Supabase Storage (bukti bayar, foto produk, QRIS) |
| Ongkir | Komerce API (cek ongkir via client-side/proxy) |
| Hosting | Vercel / Netlify / Static Web Hosting |
| State cart | React Context + localStorage |

## Struktur Folder (React + Vite)

```
src/
├── components/
│   ├── cart/                    # Cart Drawer, dll.
│   ├── layout/                  # Navbar, Footer, PageHeader, PageLayout
│   └── ui/                      # Reusable components (button, input, dll.)
├── context/
│   └── CartContext.tsx          # Global cart state & actions
├── hooks/
│   └── use-mobile.ts            # Responsive state hook
├── lib/
│   ├── data.ts                  # Mock database / Initial content
│   └── utils.ts                 # Classname utility helpers
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx        # Admin Dashboard Page
│   │   └── Login.tsx            # Admin Login Page
│   ├── About.tsx                # About Page
│   ├── Cart.tsx                 # Cart Review Page
│   ├── Checkout.tsx             # Checkout Form Page
│   ├── CheckoutSuccess.tsx      # Success & Payment Instructions Page
│   ├── Contact.tsx              # Contact Us & Map Page
│   ├── Home.tsx                 # Home Page
│   ├── OurStore.tsx             # Our Store Details Page
│   ├── ProductDetail.tsx        # Single Product Detail Page
│   └── Shop.tsx                 # Shop Catalog Page
├── types/
│   └── index.ts                 # TypeScript type interfaces
├── App.css
├── App.tsx                      # App Router definitions (react-router-dom)
├── index.css                    # Global Styles (Tailwind)
└── main.tsx                     # Entry Point
```

## Alur Data Utama

### 1. Customer Checkout Flow
```
Shop → Add to Cart (localStorage via Context) → Cart Review → Checkout Form
  → [Cek Ongkir: Panggilan API Komerce langsung / via proxy serverless]
  → Pilih metode bayar (QRIS/Bank)
  → Submit order → Simpan order ke database Supabase (status='pending')
  → Redirect ke /checkout/success (order_number)
  → Upload bukti bayar → Simpan ke Supabase Storage & update status order ke 'waiting_confirmation'
  → Tombol "Konfirmasi via WA" → generate wa.me link → buka WhatsApp
```

### 2. Admin Order Management Flow
```
Admin login (Supabase Auth) → Dashboard (/admin/dashboard)
  → Orders list (filter by status)
  → Order detail → lihat bukti bayar → ubah status manual (paid/shipped/completed)
  → status='paid' otomatis masuk perhitungan cashflow (pemasukan)
```

## Integrasi Eksternal

### Komerce API (Ongkir)
- Input: kota asal (Temanggung), kota tujuan, total berat (gram, dari sum `product_variants.weight_grams × qty`)
- Output: daftar kurir & estimasi ongkir, user pilih salah satu

### WhatsApp (Link-based)
- URL Generator: `https://wa.me/6281229888033?text=<pesan encoded>`
- Pesan berisi: no. order, daftar produk & varian, total, metode bayar
- Tidak butuh API berbayar, cukup link `wa.me`

## Keamanan
- Admin routes diproteksi di level client-side (`react-router-dom` check session Supabase Auth)
- Validasi file upload: tipe (jpg/png/pdf) & ukuran (maks 5MB) di browser sebelum simpan ke Storage

## Deployment
- Vercel (Auto-deploy dari GitHub, build command: `npm run build`, output directory: `dist`)
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_KOMERCE_API_KEY`, `VITE_ADMIN_WA_NUMBER`
