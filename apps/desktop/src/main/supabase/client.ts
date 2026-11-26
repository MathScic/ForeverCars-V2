// Client Supabase unique du process main. Le renderer n'y a jamais accès : il passe par l'IPC.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@forevercars/shared";
import { SUPABASE_KEY, SUPABASE_URL } from "../config";
import { sessionStore } from "./sessionStore";

let client: SupabaseClient<Database> | null = null;

export function db(): SupabaseClient<Database> {
  client ??= createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: { storage: sessionStore, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return client;
}

/**
 * Fermeture de l'app : la session est révoquée côté Supabase (un jeton copié ne servirait plus).
 * 3 secondes au plus : sans internet, l'app se ferme quand même (la session n'existe déjà qu'en mémoire).
 */
export async function revokeSessionOnQuit(): Promise<void> {
  if (!client) return;
  const { data } = await client.auth.getSession();
  if (!data.session) return;
  await Promise.race([client.auth.signOut({ scope: "local" }), new Promise((r) => setTimeout(r, 3000))]);
}

/** Identifiant de la personne connectée (lu dans la session locale, sans appel réseau). */
export async function currentUserId(): Promise<string | null> {
  const { data } = await db().auth.getSession();
  return data.session?.user.id ?? null;
}
