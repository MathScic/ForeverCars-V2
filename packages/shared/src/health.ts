/** Réponse de la sonde `/api/health` : volontairement minimale (aucune info d'environnement). */
export function healthStatus(): { ok: true } {
  return { ok: true };
}
