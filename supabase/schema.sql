-- ============================================
-- SURYATJI COFFEE - SUPABASE SCHEMA
-- Jalankan file ini di Supabase SQL Editor
-- ============================================

create extension if not exists "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  parent_id uuid references categories(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================
-- PRODUCTS
-- ============================================
create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  origin text,
  features text[] default '{}',
  tags text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  sort_order int default 0
);

-- ============================================
-- PRODUCT VARIANTS
-- ============================================
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  weight text not null check (weight in ('250g','500g','1kg')),
  grind_type text not null check (grind_type in ('whole_bean','coarse','medium','fine','espresso')),
  weight_grams int not null,
  sku text unique not null,
  price numeric(12,2) not null,
  stock int not null default 0,
  created_at timestamptz default now()
);

-- ============================================
-- BANK ACCOUNTS & QRIS (Settings)
-- ============================================
create table bank_accounts (
  id uuid primary key default uuid_generate_v4(),
  bank_name text not null,
  account_number text not null,
  account_holder text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table qris_settings (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- ORDERS
-- ============================================
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text not null,
  province text not null,
  city text not null,
  district text not null,
  postal_code text,
  shipping_cost numeric(12,2) default 0,
  courier text,
  subtotal numeric(12,2) not null,
  total numeric(12,2) not null,
  payment_method text not null check (payment_method in ('qris','bank_transfer')),
  bank_account_id uuid references bank_accounts(id),
  status text not null default 'pending' check (status in ('pending','waiting_confirmation','paid','shipped','completed','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_variant_id uuid references product_variants(id),
  product_name_snapshot text not null,
  variant_label_snapshot text not null,
  qty int not null,
  price_snapshot numeric(12,2) not null
);

create table payment_proofs (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  image_url text not null,
  uploaded_at timestamptz default now()
);

-- ============================================
-- CASHFLOW - EXPENSES (manual)
-- ============================================
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  description text not null,
  amount numeric(12,2) not null,
  date date not null default current_date,
  created_at timestamptz default now()
);

-- ============================================
-- ADMIN USERS (linked to Supabase Auth)
-- ============================================
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_products_category on products(category_id);
create index idx_variants_product on product_variants(product_id);
create index idx_order_items_order on order_items(order_id);
create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);
create index idx_expenses_date on expenses(date desc);

-- ============================================
-- STORAGE BUCKETS (jalankan via Supabase Dashboard > Storage, atau via SQL)
-- ============================================
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('qris', 'qris', true) on conflict do nothing;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table bank_accounts enable row level security;
alter table qris_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payment_proofs enable row level security;
alter table expenses enable row level security;
alter table admin_users enable row level security;

-- Public read: katalog produk & payment settings
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (is_active = true);
create policy "public read product_images" on product_images for select using (true);
create policy "public read product_variants" on product_variants for select using (true);
create policy "public read bank_accounts" on bank_accounts for select using (is_active = true);
create policy "public read qris_settings" on qris_settings for select using (is_active = true);

-- Public insert: guest checkout (orders, order_items, payment_proofs)
create policy "public insert orders" on orders for insert with check (true);
create policy "public insert order_items" on order_items for insert with check (true);
create policy "public insert payment_proofs" on payment_proofs for insert with check (true);

-- Admin (authenticated) full access ke semua tabel
create policy "admin full access categories" on categories for all using (auth.role() = 'authenticated');
create policy "admin full access products" on products for all using (auth.role() = 'authenticated');
create policy "admin full access product_images" on product_images for all using (auth.role() = 'authenticated');
create policy "admin full access product_variants" on product_variants for all using (auth.role() = 'authenticated');
create policy "admin full access bank_accounts" on bank_accounts for all using (auth.role() = 'authenticated');
create policy "admin full access qris_settings" on qris_settings for all using (auth.role() = 'authenticated');
create policy "admin read orders" on orders for select using (auth.role() = 'authenticated');
create policy "admin update orders" on orders for update using (auth.role() = 'authenticated');
create policy "admin read order_items" on order_items for select using (auth.role() = 'authenticated');
create policy "admin read payment_proofs" on payment_proofs for select using (auth.role() = 'authenticated');
create policy "admin full access expenses" on expenses for all using (auth.role() = 'authenticated');
create policy "admin read admin_users" on admin_users for select using (auth.role() = 'authenticated');


-- ============================================
-- SEED DATA: Bank Accounts & Categories (Suryatji Coffee)
-- ============================================
insert into bank_accounts (bank_name, account_number, account_holder, is_active) values
  ('BCA', '1234567890', 'Saryadi Suryatji', true),
  ('BSI', '0987654321', 'Saryadi Suryatji', true),
  ('Mandiri', '1122334455', 'Saryadi Suryatji', true);

insert into categories (name, slug) values
  ('Arabica', 'arabica'),
  ('Robusta', 'robusta'),
  ('Blend', 'blend');

-- ============================================
-- STORAGE POLICIES
-- ============================================
-- product-images: public read, admin write
create policy "public read product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admin upload product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin update product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin delete product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- payment-proofs: anonymous can upload, admin can read
create policy "public upload payment-proofs"
  on storage.objects for insert
  with check (bucket_id = 'payment-proofs');

create policy "admin read payment-proofs"
  on storage.objects for select
  using (bucket_id = 'payment-proofs' and auth.role() = 'authenticated');

-- qris: public read, admin manage
create policy "public read qris"
  on storage.objects for select
  using (bucket_id = 'qris');

create policy "admin manage qris"
  on storage.objects for all
  using (bucket_id = 'qris' and auth.role() = 'authenticated');

