-- Véhicules : remplace les documents « vehicle » de Sanity. L'identifiant (uuid) peut être créé
-- par l'app hors ligne puis synchronisé ; les tables restent petites (quelques milliers de lignes).
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  file_number text not null unique,               -- n° de dossier interne : FC-2026-0007
  slug text not null unique,                      -- URL du site, inchangée lors de la migration
  plate text,                                     -- facultative (souvent masquée)
  vin text,
  brand text not null,
  model text not null,
  version text not null default '',               -- finition : « 1.2 PureTech 130 GT »
  year smallint not null check (year between 1950 and 2100),
  first_registration date,
  fuel public.fuel_type not null,
  gearbox public.gearbox_type not null,
  body public.body_type,
  power_hp smallint check (power_hp > 0),
  fiscal_hp smallint check (fiscal_hp > 0),
  color text not null default '',
  critair smallint check (critair between 0 and 5),
  mileage integer not null check (mileage >= 0),
  owners smallint check (owners >= 0),
  warranty_months smallint not null default 12 check (warranty_months >= 0),
  price numeric(10, 2) not null check (price >= 0),
  description text not null default '',
  description_is_auto boolean not null default true,
  equipment text[] not null default '{}',
  status public.vehicle_status not null default 'draft',
  is_featured boolean not null default false,     -- coup de cœur, mis en avant sur l'accueil
  is_new boolean not null default true,           -- badge « Nouveau » du site
  published_at timestamptz,
  sold_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revision integer not null default 1             -- synchronisation : voir private.bump_revision()
);

-- Index : clés étrangères, puis les deux listes du site (stock et vendus), puis la synchronisation.
create index vehicles_created_by_idx on public.vehicles (created_by);
create index vehicles_updated_by_idx on public.vehicles (updated_by);
create index vehicles_visible_idx on public.vehicles (created_at desc) where status in ('online', 'reserved');
create index vehicles_sold_idx on public.vehicles (sold_at desc) where status = 'sold';
create index vehicles_updated_at_idx on public.vehicles (updated_at);

create trigger vehicles_set_updated_at
  before update on public.vehicles
  for each row execute function private.set_updated_at();
create trigger vehicles_bump_revision
  before update on public.vehicles
  for each row execute function private.bump_revision();

-- Verrou : rien n'est lisible ni modifiable par l'API tant que les règles RLS ne sont pas écrites.
alter table public.vehicles enable row level security;

-- Droits d'accès (la RLS décidera ensuite des LIGNES) : le site lit, l'app connectée lit et écrit.
grant select on public.vehicles to anon;
grant select, insert, update, delete on public.vehicles to authenticated;
grant select, insert, update, delete on public.vehicles to service_role;
