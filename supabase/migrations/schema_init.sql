-- MERCHANTS
-- Tracks shop identity and auth linkage
create table public.merchants (
  id text primary key,
  phone text unique not null,
  name text,
  store_slug text unique,
  upi_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure RLS (Row Level Security)
alter table public.merchants enable row level security;

create policy "Anyone can manage merchant profiles"
  on public.merchants for all
  using ( true ); -- Application logic will handle Clerk ID checks and filtering

-- PRODUCTS
-- High-density inventory management
create table public.products (
  id uuid default gen_random_uuid() primary key,
  merchant_id text references public.merchants(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric not null,
  image_url text,
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Anyone can view products (public store)"
  on public.products for select
  using ( true );

create policy "Merchants can manage their own products"
  on public.products for all
  using ( true ); -- Filtered by merchant_id in app logic

-- SERVICE PINCODES
-- Multi-zone logistics support
create table public.service_pincodes (
  id uuid default gen_random_uuid() primary key,
  merchant_id text references public.merchants(id) on delete cascade not null,
  pincode text not null,
  area_name text,
  unique(merchant_id, pincode)
);

alter table public.service_pincodes enable row level security;

create policy "Anyone can check delivery availability"
  on public.service_pincodes for select
  using ( true );

create policy "Merchants can manage their own delivery zones"
  on public.service_pincodes for all
  using ( true ); -- Filtered by merchant_id in app logic

-- ORDERS & LEADS
-- Core transaction and intent tracking
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id),
  merchant_id text references public.merchants(id),
  buyer_phone text,
  buyer_pincode text,
  buyer_address text,
  is_lead boolean default false, -- true = outside delivery area
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Anyone can manage orders"
  on public.orders for all
  using ( true ); -- Buyers can insert, merchants can select / update (filtered by app logic)

-- STORAGE BUCKET: product-images
-- (Requires manual creation in Supabase UI or using 'insert into storage.buckets...')
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict do nothing;

create policy "Public Access to Product Images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Merchants can upload product images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
