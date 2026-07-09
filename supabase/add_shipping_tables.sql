-- Create tables for caching shipping destinations (RajaOngkir/Komerce)

create table if not exists public.shipping_provinces (
  id int primary key,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.shipping_cities (
  id int primary key,
  province_id int not null references public.shipping_provinces(id) on delete cascade,
  name text not null,
  type text, -- e.g. Kota or Kabupaten
  created_at timestamptz default now()
);

create table if not exists public.shipping_districts (
  id int primary key,
  city_id int not null references public.shipping_cities(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.shipping_sub_districts (
  id int primary key,
  district_id int not null references public.shipping_districts(id) on delete cascade,
  name text not null,
  zip_code text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.shipping_provinces enable row level security;
alter table public.shipping_cities enable row level security;
alter table public.shipping_districts enable row level security;
alter table public.shipping_sub_districts enable row level security;

-- Public read policies
create policy "Allow public read on shipping_provinces" on public.shipping_provinces
  for select using (true);
create policy "Allow public read on shipping_cities" on public.shipping_cities
  for select using (true);
create policy "Allow public read on shipping_districts" on public.shipping_districts
  for select using (true);
create policy "Allow public read on shipping_sub_districts" on public.shipping_sub_districts
  for select using (true);

-- Public insert policies (client-side caching)
create policy "Allow public insert on shipping_provinces" on public.shipping_provinces
  for insert with check (true);
create policy "Allow public insert on shipping_cities" on public.shipping_cities
  for insert with check (true);
create policy "Allow public insert on shipping_districts" on public.shipping_districts
  for insert with check (true);
create policy "Allow public insert on shipping_sub_districts" on public.shipping_sub_districts
  for insert with check (true);
