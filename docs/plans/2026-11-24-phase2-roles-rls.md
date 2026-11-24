# Phase 2 — Rôles et règles RLS (partie à taper toi-même)

Projet Supabase : **forevercars** (`vptxtgqduoxdutimivnv`, Paris). Les tables existent déjà
(migrations `supabase/migrations/2026112413…`), avec la RLS **activée et aucune règle** :
tout est refusé tant que tu n'as pas écrit les règles ci-dessous.

## Pourquoi

La sécurité vit dans la base, pas dans l'app : même si quelqu'un trafique l'app ou appelle l'API
à la main, Postgres ne lui rend que les lignes que les règles autorisent. Deux couches :

- **les droits** (déjà posés par mes migrations) : qui peut toucher une table. Le site n'a
  aucun droit sur les coûts, documents, profils et journal ; personne ne peut réécrire le journal ;
  personne ne peut changer son propre rôle ;
- **les règles RLS** (ta partie) : quelles **lignes** chacun voit ou modifie.

```
Site (anon) ──────────────▶ véhicules en ligne, réservés, vendus + leurs photos   (jamais un brouillon)
App, vendeur (connecté) ──▶ tous les véhicules, photos, documents : lire, créer, modifier
                            ✗ coûts, ✗ suppression, ✗ lecture du journal
App, admin (connecté) ────▶ tout, y compris coûts, suppressions et journal
                 le rôle est lu dans profiles.role par private.is_admin()
```

## Avant de commencer (2 minutes, tableau de bord Supabase)

**Authentication → Sign In / Providers → décoche « Allow new users to sign up ».**
Sinon n'importe qui pourrait se créer un compte et devenir « vendeur ». Les comptes de l'équipe
seront créés par invitation (écran Équipe, plus tard).

## Où taper

Dans un terminal, à la racine du projet : `supabase migration new roles_and_rls`
→ ouvre le fichier créé dans `supabase/migrations/` et tape les blocs des étapes 1 à 3 dedans, dans l'ordre.

Pour vérifier un bloc sans rien enregistrer : dans **SQL Editor**, colle
`begin;` + le bloc + la requête de vérification + `rollback;` puis **Run**.

## Étape 1 — Les fonctions de rôle

Pourquoi `security definer` : la fonction lit `profiles`, qui a elle-même des règles ; sans ça,
une règle de `profiles` qui appelle `is_admin()` tournerait en boucle. Pourquoi le schéma `private` :
il n'est pas exposé par l'API, personne ne peut appeler ces fonctions de l'extérieur.
Pourquoi `(select auth.uid())` : calculé une fois par requête au lieu d'une fois par ligne.

```sql
create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid())) $$;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin') $$;

revoke execute on function private.is_staff(), private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_staff(), private.is_admin() to authenticated;
```

Vérifier : `select private.is_admin() as admin;` → **false** (personne n'est connecté dans l'éditeur).

## Étape 2 — Le profil créé à l'inscription

Chaque nouveau compte reçoit un profil **vendeur**. Le rôle ne vient jamais des données envoyées
à l'inscription (modifiables par l'utilisateur) : seul un admin pourra le changer.

```sql
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;
revoke execute on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
```

Vérifier (dans la même transaction) :
`insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000c3', 'essai@test.local');`
puis `select role from public.profiles where id = '00000000-0000-0000-0000-0000000000c3';` → **seller**.

## Étape 3 — Les règles, table par table

Une règle = une action (`select`, `insert`, `update`, `delete`) pour un rôle (`anon` = le site,
`authenticated` = l'app). `using` filtre les lignes existantes, `with check` contrôle ce qu'on écrit.

```sql
-- Véhicules
create policy "site : véhicules visibles" on public.vehicles
  for select to anon using (status in ('online', 'reserved', 'sold'));
create policy "équipe : lit les véhicules" on public.vehicles
  for select to authenticated using ((select private.is_staff()));
create policy "équipe : crée des véhicules" on public.vehicles
  for insert to authenticated with check ((select private.is_staff()));
create policy "équipe : modifie les véhicules" on public.vehicles
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "admin : supprime des véhicules" on public.vehicles
  for delete to authenticated using ((select private.is_admin()));

-- Photos (le site ne voit que celles des véhicules visibles)
create policy "site : photos des véhicules visibles" on public.vehicle_photos
  for select to anon using (exists (
    select 1 from public.vehicles v where v.id = vehicle_id and v.status in ('online', 'reserved', 'sold')));
create policy "équipe : lit les photos" on public.vehicle_photos
  for select to authenticated using ((select private.is_staff()));
create policy "équipe : ajoute des photos" on public.vehicle_photos
  for insert to authenticated with check ((select private.is_staff()));
create policy "équipe : modifie les photos" on public.vehicle_photos
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "admin : supprime des photos" on public.vehicle_photos
  for delete to authenticated using ((select private.is_admin()));

-- Coûts : admin uniquement, pour tout
create policy "admin : coûts" on public.vehicle_costs
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Documents
create policy "équipe : lit les documents" on public.vehicle_documents
  for select to authenticated using ((select private.is_staff()));
create policy "équipe : ajoute des documents" on public.vehicle_documents
  for insert to authenticated with check ((select private.is_staff()));
create policy "équipe : remplace des documents" on public.vehicle_documents
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "admin : supprime des documents" on public.vehicle_documents
  for delete to authenticated using ((select private.is_admin()));

-- Profils : chacun le sien, l'admin tous ; on ne corrige que son nom (le rôle est bloqué par les droits)
create policy "chacun lit son profil, l'admin tous" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select private.is_admin()));
create policy "chacun corrige son nom" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Journal : chacun écrit en son propre nom, seul l'admin lit
create policy "équipe : écrit au journal en son nom" on public.activity_log
  for insert to authenticated with check ((select private.is_staff()) and actor_id = (select auth.uid()));
create policy "admin : lit le journal" on public.activity_log
  for select to authenticated using ((select private.is_admin()));
```

## Étape 4 — Appliquer puis tester

1. Dis-moi « applique » : j'enregistre ta migration sur le projet (l'historique reste propre).
2. Colle le contenu de `supabase/tests/rls.test.sql` dans **SQL Editor** → **Run**.
   Résultat attendu : un message rouge (volontaire, il annule tout) qui liste **21 lignes « ok »**.
   Une ligne « not ok » dit exactement quelle règle manque ou laisse passer trop.

## Étape 5 — Ton compte admin

1. **Authentication → Users → Add user → Create new user** : ton e-mail, un mot de passe, « Auto Confirm ».
2. SQL Editor : `update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'TON-EMAIL');`
3. Vérifier : `select full_name, role from public.profiles;` → ta ligne avec **admin**.

## À trancher (avant de taper)

1. **Le site voit les véhicules vendus.** Le plan disait « en ligne seulement », mais la page
   « Vendu » du site en a besoin. Les règles ci-dessus l'autorisent (sans les coûts, bien sûr).
2. **Supprimer une photo** : réservé à l'admin, comme le dit le plan (« vendeur : pas de suppression »).
   Mais dans l'assistant, un vendeur voudra retirer une photo ratée. Si tu préfères l'autoriser,
   remplace `is_admin` par `is_staff` dans la règle « admin : supprime des photos ».
3. **Supprimer un document** : même question, même réglage.
