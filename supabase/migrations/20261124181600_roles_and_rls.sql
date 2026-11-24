-- Rôles et règles d'accès (RLS) : qui voit et modifie quelles lignes.
-- Site (anon) : véhicules visibles et leurs photos. Équipe (compte + profil) : travaille sur tout sauf les coûts.
-- Gérant (admin) : tout, y compris coûts, journal et suppression de véhicules.
-- Comptes sur invitation uniquement : aucun profil n'est créé à l'inscription (un compte sans profil ne voit rien).

create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid())) $$;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin') $$;

revoke execute on function private.is_staff(), private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_staff(), private.is_admin() to authenticated;

-- Véhicules
create policy "site : véhicules visibles" on public.vehicles
  for select to anon using (status in ('online', 'reserved', 'sold'));
create policy "équipe : lit les véhicules" on public.vehicles
  for select to authenticated using ((select private.is_staff()));
create policy "équipe : crée des véhicules" on public.vehicles
  for insert to authenticated with check ((select private.is_staff()));
create policy "équipe : modifie les véhicules" on public.vehicles
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "gérant : supprime des véhicules" on public.vehicles
  for delete to authenticated using ((select private.is_admin()));

-- Photos (le site ne voit que celles des véhicules visibles ; l'équipe peut retirer une photo ratée)
create policy "site : photos des véhicules visibles" on public.vehicle_photos
  for select to anon using (exists (
    select 1 from public.vehicles v where v.id = vehicle_id and v.status in ('online', 'reserved', 'sold')));
create policy "équipe : lit les photos" on public.vehicle_photos
  for select to authenticated using ((select private.is_staff()));
create policy "équipe : ajoute des photos" on public.vehicle_photos
  for insert to authenticated with check ((select private.is_staff()));
create policy "équipe : modifie les photos" on public.vehicle_photos
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "équipe : retire des photos" on public.vehicle_photos
  for delete to authenticated using ((select private.is_staff()));

-- Coûts : gérant uniquement
create policy "gérant : coûts" on public.vehicle_costs
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Documents (équipe)
create policy "équipe : lit les documents" on public.vehicle_documents
  for select to authenticated using ((select private.is_staff()));
create policy "équipe : ajoute des documents" on public.vehicle_documents
  for insert to authenticated with check ((select private.is_staff()));
create policy "équipe : remplace des documents" on public.vehicle_documents
  for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "équipe : retire des documents" on public.vehicle_documents
  for delete to authenticated using ((select private.is_staff()));

-- Profils : chacun le sien, le gérant tous ; on ne corrige que son nom (le rôle est bloqué par les droits)
create policy "chacun lit son profil, le gérant tous" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select private.is_admin()));
create policy "chacun corrige son nom" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Journal : chacun écrit en son propre nom, seul le gérant lit
create policy "équipe : écrit au journal en son nom" on public.activity_log
  for insert to authenticated with check ((select private.is_staff()) and actor_id = (select auth.uid()));
create policy "gérant : lit le journal" on public.activity_log
  for select to authenticated using ((select private.is_admin()));

-- Stockage des photos : lecture publique (URL publique), écriture par l'équipe
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-photos', 'vehicle-photos', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "équipe : liste les photos stockées" on storage.objects
  for select to authenticated using (bucket_id = 'vehicle-photos' and (select private.is_staff()));
create policy "équipe : dépose des photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'vehicle-photos' and (select private.is_staff()));
create policy "équipe : remplace des photos stockées" on storage.objects
  for update to authenticated using (bucket_id = 'vehicle-photos' and (select private.is_staff()))
  with check (bucket_id = 'vehicle-photos' and (select private.is_staff()));
create policy "équipe : retire des photos stockées" on storage.objects
  for delete to authenticated using (bucket_id = 'vehicle-photos' and (select private.is_staff()));
