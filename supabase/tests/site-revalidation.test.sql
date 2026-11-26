-- Tests de la mise à jour immédiate du site : la base prévient le site seulement quand quelque chose
-- change vraiment, avec la bonne clé. Même principe que rls.test.sql (résultat affiché comme une erreur
-- qui annule tout : aucun appel n'est réellement envoyé). Résultat attendu : 10 lignes « ok ».
-- (Pas d'essai de suppression ici : l'outil demande alors une confirmation ; le cas « supprimé » est vérifié en vrai.)
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();
create temp table tap (n serial, line text) on commit drop;
grant all on tap to anon, authenticated;
grant usage on sequence tap_n_seq to anon, authenticated;

-- Appels mis en file par pg_net vers le site (photographiés à chaque étape).
create temp table calls (step text primary key, n int) on commit drop;
create function pg_temp.mark(s text) returns void language sql as $$
  insert into calls select s, count(*) from net.http_request_queue where url = 'https://www.forevercars.fr/api/revalidate' $$;
create function pg_temp.delta(a text, b text) returns int language sql as $$
  select (select n from calls where step = b) - (select n from calls where step = a) $$;

select pg_temp.mark('0');
insert into public.vehicles (id, file_number, slug, brand, model, year, fuel, gearbox, mileage, price, status)
  values ('00000000-0000-0000-0000-0000000000f1', 'FC-T-8800', 't-site', 'Audi', 'A3', 2021, 'diesel', 'manuelle', 1, 15000, 'online');
select pg_temp.mark('ajout');
update public.vehicles set updated_at = now() where id = '00000000-0000-0000-0000-0000000000f1';
select pg_temp.mark('reecriture');
insert into public.vehicles (file_number, slug, brand, model, year, fuel, gearbox, mileage, price, status)
  values ('FC-T-8800', 't-site', 'Audi', 'A3', 2021, 'diesel', 'manuelle', 1, 15000, 'online')
  on conflict (slug) do update set price = excluded.price, status = excluded.status;
select pg_temp.mark('synchro');
update public.vehicles set price = 14500 where id = '00000000-0000-0000-0000-0000000000f1';
select pg_temp.mark('prix');
select public.add_vehicle_photo('00000000-0000-0000-0000-0000000000f1', 't/site/a.webp', 1600, 1200);
select pg_temp.mark('photo');
select public.add_vehicle_photo('00000000-0000-0000-0000-0000000000f1', 't/site/b.webp', 1600, 1200);
select pg_temp.mark('photo2');
select public.set_vehicle_photos('00000000-0000-0000-0000-0000000000f1', array(
  select id from public.vehicle_photos where vehicle_id = '00000000-0000-0000-0000-0000000000f1' order by position desc));
select pg_temp.mark('ordre');

insert into tap (line) select is(pg_temp.delta('0', 'ajout'), 1, 'ajout d''un véhicule : le site est prévenu');
insert into tap (line) select is(pg_temp.delta('ajout', 'reecriture'), 0, 'réécriture sans changement : rien');
insert into tap (line) select is(pg_temp.delta('reecriture', 'synchro'), 0, 'synchro Sanity qui réécrit les mêmes valeurs : rien');
insert into tap (line) select is(pg_temp.delta('synchro', 'prix'), 1, 'changement de prix : le site est prévenu');
insert into tap (line) select is(pg_temp.delta('prix', 'photo'), 1, 'photo ajoutée : le site est prévenu');
insert into tap (line) select is(pg_temp.delta('photo2', 'ordre'), 1, 'ordre des photos changé : le site est prévenu');
insert into tap (line) select ok((
  select bool_and(headers ->> 'x-revalidate-key' = (select decrypted_secret from vault.decrypted_secrets where name = 'revalidate_key'))
  from net.http_request_queue where url = 'https://www.forevercars.fr/api/revalidate'), 'chaque appel porte la clé rangée dans Vault');

-- Un compte de l'équipe modifie un véhicule : le déclencheur ne doit jamais bloquer son enregistrement.
insert into auth.users (id, email, aud, role) values ('00000000-0000-0000-0000-0000000000b2', 'vendeur@test.local', 'authenticated', 'authenticated');
insert into public.profiles (id, full_name, role) values ('00000000-0000-0000-0000-0000000000b2', 'Vendeur test', 'seller')
  on conflict (id) do update set role = excluded.role;
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b2", "role": "authenticated"}';
insert into tap (line) select lives_ok($$ update public.vehicles set price = 14000 where id = '00000000-0000-0000-0000-0000000000f1' $$,
  'compte de l''équipe : sa modification passe (le déclencheur tourne avec ses droits limités)');
reset role;

-- Le site vérifie la clé reçue (rôle anon) : bonne clé oui, mauvaise non.
create temp table k on commit drop as select decrypted_secret as s from vault.decrypted_secrets where name = 'revalidate_key';
grant select on k to anon;
set local role anon;
set local request.jwt.claims = '{"role": "anon"}';
insert into tap (line) select is(public.revalidate_key_ok('pas-la-bonne-cle'), false, 'site : une mauvaise clé est refusée');
insert into tap (line) select is(public.revalidate_key_ok((select s from k)), true, 'site : la bonne clé est reconnue');

reset role;
do $$
begin
  raise exception E'Résultats des tests de mise à jour du site (rien n''a été envoyé ni enregistré) :\n%',
    (select string_agg(line, E'\n' order by n) from tap);
end $$;
