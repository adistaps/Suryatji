# DATABASE - Suryatji Coffee (Supabase/PostgreSQL)

## ERD Overview

```
categories ─┬─< products ─┬─< product_variants ─┬─< order_items >─ orders ─< payment_proofs
            │              │                       │
            │              └─< product_images      └─< (stock per variant)
            │
expenses (standalone, cashflow manual)
```

## Tabel

### `categories`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| name | text | e.g. "Arabica", "Robusta", "Blend" |
| slug | text unique | |
| created_at | timestamptz | |

### `products`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| category_id | uuid FK → categories | |
| name | text | |
| slug | text unique | |
| description | text | |
| origin | text | e.g. "Kledung, Temanggung" |
| is_active | boolean | default true |
| created_at | timestamptz | |

### `product_images`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| product_id | uuid FK → products | |
| image_url | text | Supabase Storage path |
| is_primary | boolean | |
| sort_order | int | |

### `product_variants`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| product_id | uuid FK → products | |
| weight | text | enum: '250g','500g','1kg' |
| grind_type | text | enum: 'whole_bean','coarse','medium','fine','espresso' |
| sku | text unique | |
| price | numeric(12,2) | |
| stock | int | |
| weight_grams | int | untuk kalkulasi ongkir (250/500/1000) |

### `orders`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| order_number | text unique | e.g. "SC-20260707-0001" |
| customer_name | text | |
| customer_phone | text | |
| customer_address | text | |
| province | text | |
| city | text | |
| district | text | |
| postal_code | text | |
| shipping_cost | numeric(12,2) | dari API Komerce |
| courier | text | e.g. "JNE REG" |
| subtotal | numeric(12,2) | |
| total | numeric(12,2) | subtotal + shipping_cost |
| payment_method | text | enum: 'qris','bank_transfer' |
| bank_account_id | uuid FK → bank_accounts | nullable jika QRIS |
| status | text | enum: 'pending','waiting_confirmation','paid','shipped','completed','cancelled' |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `order_items`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK → orders | |
| product_variant_id | uuid FK → product_variants | |
| product_name_snapshot | text | jaga histori jika produk berubah |
| variant_label_snapshot | text | e.g. "500g - Medium Grind" |
| qty | int | |
| price_snapshot | numeric(12,2) | |

### `payment_proofs`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK → orders | |
| image_url | text | Supabase Storage |
| uploaded_at | timestamptz | |

### `bank_accounts`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| bank_name | text | e.g. "BCA", "BSI" |
| account_number | text | |
| account_holder | text | |
| is_active | boolean | |

### `qris_settings`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| image_url | text | gambar QRIS statis |
| is_active | boolean | |

### `expenses` (Cashflow - pengeluaran manual)
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | |
| category | text | e.g. "Bahan Baku", "Operasional", "Marketing" |
| description | text | |
| amount | numeric(12,2) | |
| date | date | |
| created_at | timestamptz | |

### `admin_users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | terhubung ke Supabase Auth |
| email | text | |
| name | text | |

## Catatan Cashflow
Pemasukan dihitung otomatis: `SUM(orders.total) WHERE status = 'paid' OR 'shipped' OR 'completed'`, dikurangi `SUM(expenses.amount)` pada rentang tanggal yang sama → saldo berjalan di dashboard.

## Row Level Security (RLS)
- `products`, `product_variants`, `categories`, `product_images`, `bank_accounts`, `qris_settings`: public read (untuk shop), write hanya admin
- `orders`, `order_items`, `payment_proofs`: insert public (checkout tanpa login), read/update hanya admin (via service role atau RLS policy by admin auth)
- `expenses`, `admin_users`: admin only, full private
