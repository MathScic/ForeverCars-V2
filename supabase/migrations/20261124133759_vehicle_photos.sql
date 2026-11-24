-- Photos d'un véhicule : fichiers dans le bucket Storage « vehicle-photos », ordre d'affichage
-- par « position » (la position 0 est la couverture, comme dans l'app).
create table public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  storage_path text not null unique,
  position smallint not null check (position >= 0),
  width integer check (width > 0),
  height integer check (height > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revision integer not null default 1,
  -- Unique par véhicule, vérifiée en fin de transaction : on peut réordonner toutes les photos d'un coup.
  -- Cet index (vehicle_id, position) sert aussi à la clé étrangère vehicle_id.
  constraint vehicle_photos_position_key unique (vehicle_id, position) deferrable initially deferred
);

create trigger vehicle_photos_set_updated_at
  before update on public.vehicle_photos
  for each row execute function private.set_updated_at();
create trigger vehicle_photos_bump_revision
  before update on public.vehicle_photos
  for each row execute function private.bump_revision();

alter table public.vehicle_photos enable row level security;

grant select on public.vehicle_photos to anon;
grant select, insert, update, delete on public.vehicle_photos to authenticated;
grant select, insert, update, delete on public.vehicle_photos to service_role;
