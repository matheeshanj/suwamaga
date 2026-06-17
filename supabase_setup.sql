-- ================================================================
-- සුවමග — Supabase Database Setup
-- Run this entire script in Supabase SQL Editor
-- ================================================================

-- ARTICLES
create table articles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title_si text not null,
  title_en text,
  category text,
  summary text,
  overview text,
  symptoms jsonb,
  causes jsonb,
  warning_signs jsonb,
  treatment text,
  selfcare jsonb,
  prevention jsonb,
  see_doctor text,
  tags jsonb,
  reviewer text,
  reviewed_date date,
  featured boolean default false
);

-- SPECIALISTS
create table specialists (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  qual text,
  specialty text,
  hospital text,
  district text,
  division text,
  phone text,
  availability text,
  opd text
);

-- HOSPITALS
create table hospitals (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  address text,
  district text,
  division text,
  phone text,
  services jsonb,
  hours text,
  emergency boolean default false
);

-- PHARMACIES
create table pharmacies (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  address text,
  district text,
  division text,
  phone text,
  hours text,
  delivery boolean default false
);

-- LABS
create table labs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  address text,
  district text,
  division text,
  phone text,
  hours text,
  home_service boolean default false,
  tests jsonb
);

-- MEDICAL CENTRES
create table medical_centres (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  address text,
  district text,
  division text,
  phone text,
  hours text
);

-- FAQS (Ask a Doctor answered questions)
create table faqs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  question text,
  answer text,
  answered_by text,
  date date
);

-- NEWS (optional home screen news items)
create table news (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text,
  tag text,
  date date
);

-- ── Row Level Security ────────────────────────────────────────────
alter table articles      enable row level security;
alter table specialists   enable row level security;
alter table hospitals     enable row level security;
alter table pharmacies    enable row level security;
alter table labs          enable row level security;
alter table medical_centres enable row level security;
alter table faqs          enable row level security;
alter table news          enable row level security;

-- Public can READ everything
create policy "Public read articles"       on articles       for select using (true);
create policy "Public read specialists"    on specialists    for select using (true);
create policy "Public read hospitals"      on hospitals      for select using (true);
create policy "Public read pharmacies"     on pharmacies     for select using (true);
create policy "Public read labs"           on labs           for select using (true);
create policy "Public read medical_centres" on medical_centres for select using (true);
create policy "Public read faqs"           on faqs           for select using (true);
create policy "Public read news"           on news           for select using (true);

-- Anon key can WRITE (admin panel uses this)
create policy "Anon write articles"        on articles       for all using (true);
create policy "Anon write specialists"     on specialists    for all using (true);
create policy "Anon write hospitals"       on hospitals      for all using (true);
create policy "Anon write pharmacies"      on pharmacies     for all using (true);
create policy "Anon write labs"            on labs           for all using (true);
create policy "Anon write medical_centres" on medical_centres for all using (true);
create policy "Anon write faqs"            on faqs           for all using (true);
create policy "Anon write news"            on news           for all using (true);
