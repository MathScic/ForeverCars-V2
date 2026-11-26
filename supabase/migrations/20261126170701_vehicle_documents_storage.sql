-- Pièces des dossiers véhicules (carte grise, CT, non-gage, factures, documents de vente) : espace PRIVÉ.
-- Jamais lisibles par le site ni par une adresse publique ; l'équipe les ajoute, les ouvre, les remplace, les retire.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-documents', 'vehicle-documents', false, 20971520,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do nothing;

create policy "équipe : lit les pièces des dossiers" on storage.objects
  for select to authenticated using (bucket_id = 'vehicle-documents' and (select private.is_staff()));
create policy "équipe : ajoute des pièces" on storage.objects
  for insert to authenticated with check (bucket_id = 'vehicle-documents' and (select private.is_staff()));
create policy "équipe : remplace des pièces" on storage.objects
  for update to authenticated using (bucket_id = 'vehicle-documents' and (select private.is_staff()))
  with check (bucket_id = 'vehicle-documents' and (select private.is_staff()));
create policy "équipe : retire des pièces" on storage.objects
  for delete to authenticated using (bucket_id = 'vehicle-documents' and (select private.is_staff()));
