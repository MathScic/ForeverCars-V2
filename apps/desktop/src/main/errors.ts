// Erreurs Supabase / réseau → phrases claires pour l'équipe (aucun jargon technique à l'écran).
interface ErrLike {
  code?: string;
  message?: string;
  name?: string;
}

export function friendly(e: unknown, fallback: string): Error {
  const err = (typeof e === "object" && e !== null ? e : {}) as ErrLike;
  const msg = String(err.message ?? e);
  if (err.name === "AuthRetryableFetchError" || /fetch failed|failed to fetch|network|ENOTFOUND|ECONNRE|ETIMEDOUT/i.test(msg)) {
    return new Error("Pas de connexion internet : vérifiez le Wi-Fi puis réessayez.");
  }
  if (err.code === "42501" || /row-level security|permission denied/i.test(msg)) {
    return new Error("Votre compte n'a pas le droit de faire cette action.");
  }
  if (err.code === "PGRST301" || /jwt expired|invalid jwt/i.test(msg)) return new Error("Session expirée : reconnectez-vous.");
  if (err.code === "23505") return new Error("Ce numéro de dossier existe déjà : réessayez, la base en donnera un autre.");
  return new Error(`${fallback} (${msg})`);
}
