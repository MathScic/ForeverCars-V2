-- Base du schéma ForeverCars : fin de l'exposition automatique, types, fonctions de trigger partagées.

-- 1. Sur ce projet, toute nouvelle table de « public » était ouverte en lecture ET en écriture
--    à anon et authenticated dès sa création. On coupe ce comportement : chaque table accorde
--    ensuite ses droits explicitement, au plus juste (voir les migrations suivantes).
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated, service_role, public;

-- 2. Valeurs reprises du site (Sanity) et de l'app : mêmes libellés techniques.
create type public.app_role as enum ('admin', 'seller');
create type public.vehicle_status as enum ('draft', 'online', 'reserved', 'sold');
create type public.fuel_type as enum ('essence', 'diesel', 'hybride', 'electrique');
create type public.gearbox_type as enum ('manuelle', 'automatique');
create type public.body_type as enum ('berline', 'suv', 'coupe', 'break', 'citadine', 'utilitaire', 'cabriolet', 'monospace');
create type public.document_type as enum (
  'carte_grise', 'controle_technique', 'non_gage', 'factures_entretien',
  'bon_de_commande', 'cession', 'facture_vente'
);

-- 3. Schéma interne, jamais exposé par l'API.
create schema if not exists private;

-- Met à jour updated_at à chaque modification.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Fait avancer « revision » à chaque modification. Sert à la synchronisation hors ligne :
-- si la revision du serveur a bougé depuis la dernière lecture de l'app, le serveur gagne
-- et l'utilisateur est prévenu.
create or replace function private.bump_revision()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.revision := old.revision + 1;
  return new;
end;
$$;
