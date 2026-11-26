-- Site à jour tout de suite (plus besoin de F5) : dès qu'un véhicule ou une photo change vraiment,
-- la base appelle https://www.forevercars.fr/api/revalidate (pg_net, sans ralentir l'app).
-- La clé est créée ici, dans Vault ; le site ne la connaît pas : il la fait vérifier par la base.

select vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'revalidate_key',
  'Clé de mise à jour du site (route /api/revalidate)');

-- Vérification de la clé reçue par le site. Ne renvoie qu'un oui/non ; 256 bits : impossible à deviner.
create or replace function public.revalidate_key_ok(k text)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from vault.decrypted_secrets where name = 'revalidate_key' and decrypted_secret = k) $$;
revoke execute on function public.revalidate_key_ok(text) from public;
grant execute on function public.revalidate_key_ok(text) to anon, authenticated;

-- Un appel par instruction, seulement si une valeur utile a changé : la synchro Sanity réécrit souvent
-- les mêmes valeurs (seuls updated_at, revision et updated_by bougent) et ne doit rien déclencher.
create or replace function private.notify_site()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  ignored constant text[] := array['updated_at', 'revision', 'updated_by'];
  changed boolean;
begin
  if tg_op = 'INSERT' then
    changed := exists (select 1 from new_rows);
  elsif tg_op = 'DELETE' then
    changed := exists (select 1 from old_rows);
  else
    changed := exists (
      select 1 from new_rows n join old_rows o on o.id = n.id
      where (to_jsonb(n) - ignored) is distinct from (to_jsonb(o) - ignored));
  end if;
  if changed then
    perform net.http_post(
      url := 'https://www.forevercars.fr/api/revalidate',
      headers := jsonb_build_object('Content-Type', 'application/json', 'x-revalidate-key',
        (select decrypted_secret from vault.decrypted_secrets where name = 'revalidate_key')),
      body := '{}'::jsonb,
      timeout_milliseconds := 5000);
  end if;
  return null;
end $$;

-- Postgres n'accepte qu'un seul événement par trigger quand on lit les lignes touchées : 3 par table.
create trigger vehicles_site_insert after insert on public.vehicles
  referencing new table as new_rows for each statement execute function private.notify_site();
create trigger vehicles_site_update after update on public.vehicles
  referencing old table as old_rows new table as new_rows for each statement execute function private.notify_site();
create trigger vehicles_site_delete after delete on public.vehicles
  referencing old table as old_rows for each statement execute function private.notify_site();
create trigger vehicle_photos_site_insert after insert on public.vehicle_photos
  referencing new table as new_rows for each statement execute function private.notify_site();
create trigger vehicle_photos_site_update after update on public.vehicle_photos
  referencing old table as old_rows new table as new_rows for each statement execute function private.notify_site();
create trigger vehicle_photos_site_delete after delete on public.vehicle_photos
  referencing old table as old_rows for each statement execute function private.notify_site();
