-- Tests : retrait d'accès d'un membre de l'équipe, et espace privé des pièces des dossiers.
-- Même principe que rls.test.sql (résultat affiché comme une erreur qui annule tout). Attendu : 6 lignes « ok ».
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();
create temp table tap (n serial, line text) on commit drop;
grant all on tap to authenticated;
grant usage on sequence tap_n_seq to authenticated;
insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-0000000000b2', 'vendeur@test.local', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000b3', 'ancien@test.local', 'authenticated', 'authenticated');
insert into public.profiles (id, full_name, role, disabled_at) values
  ('00000000-0000-0000-0000-0000000000b2', 'Vendeur actif', 'seller', null),
  ('00000000-0000-0000-0000-0000000000b3', 'Ancien admin', 'admin', now());
insert into public.vehicles (id, file_number, slug, brand, model, year, fuel, gearbox, mileage, price, status)
  values ('00000000-0000-0000-0000-0000000000e1', 'FC-T-7700', 't-acces', 'Audi', 'A3', 2021, 'diesel', 'manuelle', 1, 1, 'draft');

set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b2", "role": "authenticated"}';
insert into tap (line) select is((select count(*)::int from public.vehicles where slug = 't-acces'), 1, 'vendeur actif : voit les brouillons');

reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b3", "role": "authenticated"}';
insert into tap (line) select is((select count(*)::int from public.vehicles where slug = 't-acces'), 0, 'accès retiré : ne voit plus rien du parc');
insert into tap (line) select is(private.is_admin(), false, 'accès retiré : plus admin, même avec le rôle admin');
insert into tap (line) select throws_ok(
  $$ insert into public.vehicles (file_number, slug, brand, model, year, fuel, gearbox, mileage, price) values ('', 't-x', 'X', 'X', 2020, 'diesel', 'manuelle', 1, 1) $$,
  '42501', null, 'accès retiré : ne peut plus rien créer');

reset role;
insert into tap (line) select is((select public from storage.buckets where id = 'vehicle-documents'), false,
  'pièces des dossiers : espace privé (aucune adresse publique)');
insert into tap (line) select is((select count(*)::int from pg_policies where schemaname = 'storage' and tablename = 'objects'
  and (qual like '%vehicle-documents%' or with_check like '%vehicle-documents%')), 4,
  'pièces des dossiers : 4 règles, toutes réservées à l''équipe active');

do $$ begin
  raise exception E'Résultats (rien n''a été enregistré) :\n%', (select string_agg(line, E'\n' order by n) from tap);
end $$;
