-- Profils du back-office : un par compte Supabase Auth, avec son rôle (admin ou vendeur).
-- Les règles RLS et la création automatique du profil à l'inscription font partie de l'étape
-- « rôles et RLS », écrite à la main.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'seller',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

-- Verrou : aucune ligne n'est accessible par l'API tant que les règles RLS ne sont pas écrites.
alter table public.profiles enable row level security;

-- Le site (anon) n'a rien à faire ici. Un utilisateur connecté peut lire et corriger son nom,
-- jamais son rôle : la colonne « role » n'est pas modifiable par l'API (changement de rôle =
-- Edge Function réservée à l'admin).
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;
