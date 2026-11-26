-- Équipe : « retirer l'accès » sans rien effacer. Le compte est bloqué (Edge Function team) et le profil
-- désactivé : la RLS ne lui donne plus rien, mais ses véhicules gardent leur auteur (la synchro Sanity
-- continue de les reconnaître comme véhicules de l'app).
alter table public.profiles add column disabled_at timestamptz;

create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and disabled_at is null) $$;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin' and disabled_at is null) $$;
