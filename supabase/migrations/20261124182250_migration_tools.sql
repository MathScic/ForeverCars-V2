-- Outils de migration : appels HTTP depuis la base (pg_net) et vérification d'une clé à usage unique rangée dans Vault.
-- La clé n'apparaît jamais dans le code ni dans le dépôt : la base l'envoie elle-même à la fonction de migration.
create extension if not exists pg_net with schema extensions;

create or replace function public.migration_key_ok(k text)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from vault.decrypted_secrets where name = 'migration_key' and decrypted_secret = k) $$;

revoke execute on function public.migration_key_ok(text) from public, anon, authenticated;
grant execute on function public.migration_key_ok(text) to service_role;
