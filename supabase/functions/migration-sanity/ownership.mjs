// Partage des véhicules entre Sanity et l'app pendant la transition. Code pur, testé dans outils/migration-sanity.
// Un véhicule créé ou modifié par un compte de l'équipe (auteur noté par la base) appartient à l'app :
// la synchro Sanity ne touche plus ni à sa fiche, ni à ses photos, ni à son statut.

export const isAppOwned = (v) => Boolean(v.created_by || v.updated_by);

/** Ce que la synchro peut encore écrire, ce qu'elle doit masquer, et les fiches désormais gérées par l'app. */
export function sanityScope(existing, rows) {
  const owned = new Set(existing.filter(isAppOwned).map((v) => v.slug));
  const inSanity = new Set(rows.map((r) => r.slug));
  return {
    rows: rows.filter((r) => !owned.has(r.slug)),
    // Fiche retirée de Sanity : masquée du site, sauf si elle vient de l'app ou y a été modifiée.
    gone: existing.filter((v) => !isAppOwned(v) && !inSanity.has(v.slug)).map((v) => v.slug),
    owned,
  };
}
