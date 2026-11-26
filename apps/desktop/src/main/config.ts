// Réglages du process main. Adresse et clé PUBLIQUE du projet Supabase (les mêmes que le site) :
// cette clé ne donne accès qu'à ce que la RLS autorise. Jamais de clé service_role dans l'app.
export const SUPABASE_URL = process.env.FOREVERCARS_SUPABASE_URL ?? "https://vptxtgqduoxdutimivnv.supabase.co";
export const SUPABASE_KEY = process.env.FOREVERCARS_SUPABASE_KEY ?? "sb_publishable_EExA2aUwnA-NtYh8bLPecw_VAFy-qlL";
export const PHOTO_BUCKET = "vehicle-photos";

/** Mode démo (tests e2e, présentation) : données fictives, aucune connexion. */
export const DEMO = process.env.FOREVERCARS_DEMO === "1";

/**
 * Tant que la synchro Sanity tourne, un véhicule venu de Sanity ne peut pas être supprimé ici :
 * la synchro le recréerait. Passe à false le jour de la bascule (synchro arrêtée).
 */
export const SANITY_SYNC_ACTIVE = true;
