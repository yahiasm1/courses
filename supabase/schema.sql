-- =====================================================================
-- Courses store — Supabase schema
-- Run this whole file once in the Supabase SQL editor.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  image_url   text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Courses
-- ---------------------------------------------------------------------
create table if not exists public.courses (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text,
  image_url       text,
  price           numeric(12, 2) not null default 0,   -- in DZD
  sales_page_url  text,                                -- external sales page
  download_url    text,                                -- only revealed to buyers
  category_id     uuid references public.categories (id) on delete set null,
  is_featured     boolean not null default false,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists courses_category_idx on public.courses (category_id);

-- ---------------------------------------------------------------------
-- Profiles (one per auth user, filled at sign-up)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  first_name  text,
  last_name   text,
  phone       text,
  created_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- Purchases (one row per SlickPay checkout)
-- ---------------------------------------------------------------------
create table if not exists public.purchases (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users (id) on delete cascade,
  course_id            uuid not null references public.courses (id) on delete cascade,
  amount               numeric(12, 2) not null,
  status               text not null default 'pending'
                         check (status in ('pending', 'paid', 'failed')),
  slickpay_invoice_id  text,
  created_at           timestamptz not null default now(),
  paid_at              timestamptz
);

create index if not exists purchases_user_idx on public.purchases (user_id);
create index if not exists purchases_invoice_idx on public.purchases (slickpay_invoice_id);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.categories enable row level security;
alter table public.courses    enable row level security;
alter table public.profiles   enable row level security;
alter table public.purchases  enable row level security;

drop policy if exists "categories are public" on public.categories;
create policy "categories are public"
  on public.categories for select using (true);

drop policy if exists "published courses are public" on public.courses;
create policy "published courses are public"
  on public.courses for select using (is_published);

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "read own purchases" on public.purchases;
create policy "read own purchases"
  on public.purchases for select using (auth.uid() = user_id);
-- Purchases are only written by the server (service role key).

-- The download link must never reach the browser of someone who hasn't paid.
-- Column privileges: the public roles can read every course column EXCEPT
-- download_url. The server reads it with the service role after checking
-- that the user has a paid purchase.
revoke select on public.courses from anon, authenticated;
grant select (
  id, name, slug, description, image_url, price, sales_page_url,
  category_id, is_featured, is_published, created_at
) on public.courses to anon, authenticated;
