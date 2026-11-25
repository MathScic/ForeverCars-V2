-- Synchronisation Sanity → Supabase : photos dont une des 3 tailles (1600, 800, 480 px) manque encore dans le stockage.
-- Réservée au serveur (fonction de migration).
create or replace function public.missing_photo_paths(lim int default 30)
returns setof text language sql stable security definer set search_path = ''
as $$
  select p.storage_path from public.vehicle_photos p
  where exists (
    select 1 from unnest(array[p.storage_path, replace(p.storage_path, '.webp', '-800.webp'), replace(p.storage_path, '.webp', '-480.webp')]) as s(name)
    where not exists (select 1 from storage.objects o where o.bucket_id = 'vehicle-photos' and o.name = s.name))
  order by p.storage_path
  limit lim
$$;

revoke execute on function public.missing_photo_paths(int) from public, anon, authenticated;
grant execute on function public.missing_photo_paths(int) to service_role;
