-- Tant que Clément saisit encore dans Sanity : recopie automatique dans Supabase toutes les 10 minutes
-- (fiches, photos manquantes). À ARRÊTER quand l'app remplace Sanity : select cron.unschedule('sync-sanity');
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'sync-sanity',
  '*/10 * * * *',
  $job$
    select net.http_post(
      url := 'https://vptxtgqduoxdutimivnv.supabase.co/functions/v1/migration-sanity?action=sync',
      headers := jsonb_build_object('Content-Type', 'application/json', 'x-migration-key', (select decrypted_secret from vault.decrypted_secrets where name = 'migration_key')),
      body := '{}'::jsonb,
      timeout_milliseconds := 120000
    );
  $job$
);
