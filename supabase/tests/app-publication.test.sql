-- Tests de la publication depuis l'app : auteur, n° de dossier, slug, photos, et synchro Sanity inchangée.
-- Même principe que rls.test.sql : à coller dans l'éditeur SQL de Supabase puis « Run ». Le résultat
-- s'affiche comme une erreur qui annule tout. Résultat attendu : 16 lignes qui commencent par « ok ».
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();
create temp table tap (n serial, line text) on commit drop;
grant all on tap to anon, authenticated, service_role;
grant usage on sequence tap_n_seq to anon, authenticated, service_role;

insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin@test.local', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000b2', 'vendeur@test.local', 'authenticated', 'authenticated');
insert into public.profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'Admin test', 'admin'),
  ('00000000-0000-0000-0000-0000000000b2', 'Vendeur test', 'seller')
on conflict (id) do update set role = excluded.role, full_name = excluded.full_name;
-- Véhicule « venu de Sanity » (créé sans compte) ; son n° 9990 devient le plus grand de la base.
insert into public.vehicles (id, file_number, slug, brand, model, year, fuel, gearbox, mileage, price, status) values
  ('00000000-0000-0000-0000-000000000001', 'FC-T-9990', 't-golf', 'Volkswagen', 'Golf', 2022, 'essence', 'manuelle', 1, 1, 'online');

-- ── Un vendeur crée et modifie ──
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b2", "role": "authenticated"}';
insert into public.vehicles (id, file_number, slug, brand, model, year, fuel, gearbox, mileage, price) values
  ('00000000-0000-0000-0000-000000000011', '', 't-golf', 'Volkswagen', 'Golf', 2022, 'essence', 'manuelle', 1, 1);
insert into public.vehicles (id, file_number, slug, brand, model, year, fuel, gearbox, mileage, price) values
  ('00000000-0000-0000-0000-000000000012', 'FC-T-9990', 't-golf', 'Volkswagen', 'Golf', 2022, 'essence', 'manuelle', 1, 1);
insert into public.vehicles (id, file_number, slug, brand, model, year, fuel, gearbox, mileage, price) values
  ('00000000-0000-0000-0000-000000000013', 'FC-T-5000', 't-clio', 'Renault', 'Clio', 2021, 'essence', 'manuelle', 1, 1);
update public.vehicles set price = 2, created_by = '00000000-0000-0000-0000-0000000000a1'
  where id = '00000000-0000-0000-0000-000000000011';
insert into tap (line) select is((select file_number from public.vehicles where id = '00000000-0000-0000-0000-000000000011'),
  format('FC-%s-9991', extract(year from now())::int), 'n° vide : la base donne le suivant');
insert into tap (line) select is((select file_number from public.vehicles where id = '00000000-0000-0000-0000-000000000012'),
  format('FC-%s-9992', extract(year from now())::int), 'n° déjà pris : la base donne le suivant');
insert into tap (line) select is((select file_number from public.vehicles where id = '00000000-0000-0000-0000-000000000013'),
  'FC-T-5000', 'n° libre : gardé tel quel');
insert into tap (line) select results_eq(
  $$ select slug from public.vehicles where slug like 't-golf%' order by slug $$, $$ values ('t-golf'), ('t-golf-2'), ('t-golf-3') $$,
  'slug déjà pris : -2, -3 ajoutés, aucune fiche écrasée');
insert into tap (line) select is((select created_by from public.vehicles where id = '00000000-0000-0000-0000-000000000011'),
  '00000000-0000-0000-0000-0000000000b2'::uuid, 'auteur : posé par la base, impossible à changer');
insert into tap (line) select is((select updated_by from public.vehicles where id = '00000000-0000-0000-0000-000000000011'),
  '00000000-0000-0000-0000-0000000000b2'::uuid, 'dernière modification : notée par la base');

-- Photos : ajout à la suite, puis ordre et retrait en une fois
insert into tap (line) select results_eq(
  $$ select r.storage_path, r.position::int from unnest(array['t/a', 't/b', 't/c']) with ordinality as u(p, o)
     cross join lateral public.add_vehicle_photo('00000000-0000-0000-0000-000000000011', u.p, 1600, 1200) r order by u.o $$,
  $$ values ('t/a', 0), ('t/b', 1), ('t/c', 2) $$, 'photos : chacune prend la position suivante');
insert into tap (line) select results_eq(
  $$ select * from public.set_vehicle_photos('00000000-0000-0000-0000-000000000011', array[
       (select id from public.vehicle_photos where storage_path = 't/c'), (select id from public.vehicle_photos where storage_path = 't/a')]) $$,
  $$ values ('t/b') $$, 'photos : la photo retirée est renvoyée (fichier à effacer)');
insert into tap (line) select results_eq(
  $$ select storage_path, position::int from public.vehicle_photos where vehicle_id = '00000000-0000-0000-0000-000000000011' order by position $$,
  $$ values ('t/c', 0), ('t/a', 1) $$, 'photos : nouvel ordre enregistré, la 1re est la couverture');

-- ── L'admin modifie un véhicule venu de Sanity : il devient « de l'app » ──
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
update public.vehicles set price = 3 where id = '00000000-0000-0000-0000-000000000001';
insert into tap (line) select ok((select created_by is null and updated_by = '00000000-0000-0000-0000-0000000000a1'
  from public.vehicles where id = '00000000-0000-0000-0000-000000000001'), 'véhicule Sanity modifié dans l''app : marqué « app »');

-- ── La synchro Sanity (clé serveur, sans compte) : comportement inchangé ──
reset role;
set local role service_role;
set local request.jwt.claims = '{"role": "service_role"}';
insert into public.vehicles (file_number, slug, brand, model, year, fuel, gearbox, mileage, price, status)
  values ('FC-T-9990', 't-golf', 'Volkswagen', 'Golf', 2022, 'essence', 'manuelle', 1, 4, 'online')
  on conflict (slug) do update set price = excluded.price, file_number = excluded.file_number;
insert into tap (line) select is((select count(*)::int from public.vehicles where slug like 't-golf%'), 3, 'synchro : mise à jour par slug, aucun doublon');
insert into tap (line) select ok((select file_number = 'FC-T-9990' and price = 4 from public.vehicles where slug = 't-golf'),
  'synchro : n° et prix venus de Sanity gardés tels quels');
insert into tap (line) select is((select updated_by from public.vehicles where slug = 't-golf'),
  '00000000-0000-0000-0000-0000000000a1'::uuid, 'synchro : ne retire pas la marque « app »');
insert into public.vehicles (file_number, slug, brand, model, year, fuel, gearbox, mileage, price)
  values ('FC-T-7000', 't-sanity', 'Audi', 'A1', 2020, 'diesel', 'manuelle', 1, 1);
insert into tap (line) select ok((select created_by is null and updated_by is null from public.vehicles where slug = 't-sanity'),
  'synchro : ses véhicules restent sans auteur');

-- ── Le site (anon) ne peut pas toucher aux photos ──
reset role;
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';
insert into tap (line) select throws_ok($$ select public.set_vehicle_photos('00000000-0000-0000-0000-000000000011', '{}') $$,
  '42501', null, 'site : ne peut pas réordonner ni retirer de photos');
insert into tap (line) select throws_ok($$ select public.add_vehicle_photo('00000000-0000-0000-0000-000000000011', 'x', 1, 1) $$,
  '42501', null, 'site : ne peut pas ajouter de photo');

reset role;
do $$
begin
  raise exception E'Résultats des tests de publication (rien n''a été enregistré) :\n%',
    (select string_agg(line, E'\n' order by n) from tap);
end $$;
