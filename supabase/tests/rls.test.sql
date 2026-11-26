-- Tests des droits (RLS) : ce que le site (anon), un vendeur et un admin peuvent faire.
-- À coller dans l'éditeur SQL de Supabase puis « Run ». Le résultat s'affiche comme une erreur :
-- c'est voulu, cette erreur annule tout (données de test comprises), la base n'est pas modifiée.
-- Résultat attendu : 21 lignes qui commencent toutes par « ok » (seuls les véhicules de test « t-… » sont comptés).
-- (Avec Docker plus tard, on le passera au format `supabase test db`.)
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();

-- Les résultats sont rangés dans une table temporaire, lisible quel que soit le rôle simulé.
create temp table tap (n serial, line text) on commit drop;
grant all on tap to anon, authenticated;
grant usage on sequence tap_n_seq to anon, authenticated;

-- ── Données de test (annulées à la fin) ──
insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'admin@test.local', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000b2', 'vendeur@test.local', 'authenticated', 'authenticated');
insert into public.profiles (id, full_name, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'Admin test', 'admin'),
  ('00000000-0000-0000-0000-0000000000b2', 'Vendeur test', 'seller')
on conflict (id) do update set role = excluded.role, full_name = excluded.full_name;
insert into public.vehicles (id, file_number, slug, brand, model, year, fuel, gearbox, mileage, price, status) values
  ('00000000-0000-0000-0000-000000000001', 'FC-T-0001', 't-en-ligne', 'Peugeot', '2008', 2021, 'essence', 'automatique', 38500, 21490, 'online'),
  ('00000000-0000-0000-0000-000000000002', 'FC-T-0002', 't-reserve', 'Volkswagen', 'Golf', 2022, 'hybride', 'automatique', 27400, 26990, 'reserved'),
  ('00000000-0000-0000-0000-000000000003', 'FC-T-0003', 't-vendu', 'BMW', 'X1', 2019, 'diesel', 'automatique', 89000, 23900, 'sold'),
  ('00000000-0000-0000-0000-000000000004', 'FC-T-0004', 't-brouillon', 'Renault', 'Clio', 2021, 'essence', 'manuelle', 44800, 14490, 'draft');
insert into public.vehicle_photos (vehicle_id, storage_path, position) values
  ('00000000-0000-0000-0000-000000000001', 't/1/0.webp', 0),
  ('00000000-0000-0000-0000-000000000004', 't/4/0.webp', 0);
insert into public.vehicle_costs (vehicle_id, purchase_price, repair_cost) values
  ('00000000-0000-0000-0000-000000000001', 17200, 650);
insert into public.activity_log (actor_id, action, entity, entity_id) values
  ('00000000-0000-0000-0000-0000000000a1', 'publish', 'vehicle', '00000000-0000-0000-0000-000000000001');

-- ── Le site (anon) ──
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';
insert into tap (line) select results_eq(
  $$ select slug from public.vehicles where slug like 't-%' order by slug $$,
  $$ values ('t-en-ligne'), ('t-reserve'), ('t-vendu') $$,
  'site : voit les véhicules en ligne, réservés et vendus, jamais les brouillons');
insert into tap (line) select results_eq(
  $$ select storage_path from public.vehicle_photos where storage_path like 't/%' $$, $$ values ('t/1/0.webp') $$,
  'site : ne voit pas les photos d''un brouillon');
insert into tap (line) select throws_ok($$ select * from public.vehicle_costs $$, '42501', null, 'site : aucun accès aux coûts');
insert into tap (line) select throws_ok($$ select * from public.activity_log $$, '42501', null, 'site : aucun accès au journal');
insert into tap (line) select throws_ok($$ select * from public.profiles $$, '42501', null, 'site : aucun accès aux profils');
insert into tap (line) select throws_ok(
  $$ insert into public.vehicles (file_number, slug, brand, model, year, fuel, gearbox, mileage, price) values ('X', 'x', 'X', 'X', 2020, 'diesel', 'manuelle', 1, 1) $$,
  '42501', null, 'site : ne peut rien écrire');

-- ── Un vendeur ──
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b2", "role": "authenticated"}';
insert into tap (line) select is((select count(*)::int from public.vehicles where slug like 't-%'), 4, 'vendeur : voit tous les véhicules, brouillons compris');
insert into tap (line) select is_empty($$ select * from public.vehicle_costs $$, 'vendeur : ne voit aucun prix d''achat');
insert into tap (line) select throws_ok(
  $$ insert into public.vehicle_costs (vehicle_id, purchase_price) values ('00000000-0000-0000-0000-000000000004', 1) $$,
  '42501', null, 'vendeur : ne peut pas saisir de coûts');
insert into tap (line) select lives_ok(
  $$ insert into public.vehicles (file_number, slug, brand, model, year, fuel, gearbox, mileage, price) values ('FC-T-0005', 't-nouveau', 'Audi', 'A3', 2020, 'diesel', 'manuelle', 1, 1) $$,
  'vendeur : peut créer un véhicule');
insert into tap (line) select lives_ok(
  $$ update public.vehicles set price = 20990 where id = '00000000-0000-0000-0000-000000000001' $$, 'vendeur : peut modifier un véhicule (sans erreur)');
insert into tap (line) select is(
  (select price from public.vehicles where id = '00000000-0000-0000-0000-000000000001'), 20990.00::numeric, 'vendeur : la modification est bien enregistrée');
-- Tentative de suppression : qu'elle échoue ou ne supprime rien, le véhicule doit rester.
do $$ begin delete from public.vehicles where id = '00000000-0000-0000-0000-000000000004'; exception when others then null; end $$;
insert into tap (line) select ok(exists (select 1 from public.vehicles where id = '00000000-0000-0000-0000-000000000004'), 'vendeur : ne peut supprimer aucun véhicule');
insert into tap (line) select throws_ok(
  $$ update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-0000000000b2' $$, '42501', null, 'vendeur : ne peut pas se donner le rôle admin');
insert into tap (line) select lives_ok(
  $$ insert into public.activity_log (actor_id, action, entity) values ('00000000-0000-0000-0000-0000000000b2', 'update', 'vehicle') $$, 'vendeur : peut écrire dans le journal');
insert into tap (line) select is_empty($$ select * from public.activity_log $$, 'vendeur : ne lit pas le journal (réservé à l''admin)');

-- ── Un admin ──
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
insert into tap (line) select is((select count(*)::int from public.vehicle_costs where vehicle_id = '00000000-0000-0000-0000-000000000001'), 1, 'admin : voit les prix d''achat');
insert into tap (line) select ok((select count(*) from public.activity_log) >= 1, 'admin : lit le journal');
do $$ begin delete from public.vehicles where id = '00000000-0000-0000-0000-000000000004'; exception when others then null; end $$;
insert into tap (line) select ok(not exists (select 1 from public.vehicles where id = '00000000-0000-0000-0000-000000000004'), 'admin : peut supprimer un véhicule');
insert into tap (line) select throws_ok($$ update public.activity_log set action = 'x' $$, '42501', null, 'admin : ne peut pas réécrire le journal');
insert into tap (line) select throws_ok($$ delete from public.activity_log $$, '42501', null, 'admin : ne peut pas effacer le journal');

reset role;
-- Affiche les résultats ET annule tout : l'« erreur » qui s'affiche est volontaire, rien n'est enregistré.
do $$
begin
  raise exception E'Résultats des tests de droits (rien n''a été enregistré) :\n%',
    (select string_agg(line, E'\n' order by n) from tap);
end $$;
