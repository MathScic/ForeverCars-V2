-- Publication depuis l'app. Ces règles ne s'appliquent qu'aux comptes de l'équipe (auth.uid() connu) :
-- la synchro Sanity (clé serveur, sans compte) garde exactement son comportement.
--   1. Auteur : la base note qui crée et qui modifie. Un véhicule touché dans l'app est ainsi
--      reconnaissable, et la synchro Sanity ne l'écrase plus.
--   2. N° de dossier : gardé s'il est libre, sinon la base donne le suivant (deux postes en même temps).
--   3. Slug (adresse de la fiche sur le site) : rendu unique en ajoutant -2, -3…
--   4. Photos : ajout avec la position suivante, puis ordre et retraits enregistrés en une fois.

create or replace function private.stamp_vehicle_author()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then new.created_by := old.created_by; end if;
  if (select auth.uid()) is not null then
    if tg_op = 'INSERT' then new.created_by := (select auth.uid()); end if;
    new.updated_by := (select auth.uid());
  elsif tg_op = 'UPDATE' then
    new.updated_by := old.updated_by;
  end if;
  return new;
end $$;

create or replace function private.assign_file_number()
returns trigger language plpgsql set search_path = ''
as $$
declare n int;
begin
  if (select auth.uid()) is null then return new; end if;
  if coalesce(new.file_number, '') <> ''
     and not exists (select 1 from public.vehicles where file_number = new.file_number and id <> new.id) then
    return new;
  end if;
  -- Un poste à la fois prend le numéro suivant (le verrou est rendu à la fin de la transaction).
  perform pg_advisory_xact_lock(hashtext('vehicles.file_number'));
  select coalesce(max(substring(file_number from '(\d+)$')::int), 0) + 1 into n from public.vehicles;
  new.file_number := format('FC-%s-%s', extract(year from now())::int, lpad(n::text, 4, '0'));
  return new;
end $$;

create or replace function private.unique_vehicle_slug()
returns trigger language plpgsql set search_path = ''
as $$
declare base text := new.slug; i int := 1;
begin
  if (select auth.uid()) is null then return new; end if;
  while exists (select 1 from public.vehicles where slug = new.slug and id <> new.id) loop
    i := i + 1;
    new.slug := base || '-' || i;
  end loop;
  return new;
end $$;

create trigger vehicles_stamp_author before insert or update on public.vehicles
  for each row execute function private.stamp_vehicle_author();
create trigger vehicles_assign_file_number before insert on public.vehicles
  for each row execute function private.assign_file_number();
create trigger vehicles_unique_slug before insert or update of slug on public.vehicles
  for each row execute function private.unique_vehicle_slug();

-- Ajoute une photo à la suite des autres (position calculée ici : pas de doublon entre deux envois).
create or replace function public.add_vehicle_photo(p_vehicle uuid, p_path text, p_width int, p_height int)
returns public.vehicle_photos language plpgsql set search_path = ''
as $$
declare r public.vehicle_photos;
begin
  perform pg_advisory_xact_lock(hashtext(p_vehicle::text));
  insert into public.vehicle_photos (vehicle_id, storage_path, position, width, height)
  values (p_vehicle, p_path,
          (select coalesce(max(position), -1) + 1 from public.vehicle_photos where vehicle_id = p_vehicle),
          p_width, p_height)
  returning * into r;
  return r;
end $$;

-- Ordre voulu des photos (la première est la couverture) ; celles absentes de la liste sont retirées.
-- Renvoie les chemins retirés, pour effacer leurs fichiers.
create or replace function public.set_vehicle_photos(p_vehicle uuid, p_ids uuid[])
returns setof text language plpgsql set search_path = ''
as $$
begin
  return query
    with gone as (
      delete from public.vehicle_photos where vehicle_id = p_vehicle and not (id = any (p_ids)) returning storage_path
    ) select gone.storage_path from gone;
  update public.vehicle_photos set position = array_position(p_ids, id) - 1
  where vehicle_id = p_vehicle and id = any (p_ids);
end $$;

-- Fonctions de l'équipe uniquement (droits de la personne connectée : la RLS s'applique).
revoke execute on function public.add_vehicle_photo(uuid, text, int, int), public.set_vehicle_photos(uuid, uuid[])
  from public, anon;
grant execute on function public.add_vehicle_photo(uuid, text, int, int), public.set_vehicle_photos(uuid, uuid[])
  to authenticated;
