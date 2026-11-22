const PATTERN = /^FC-(\d{4})-(\d{4})$/;

/**
 * Numéro de dossier suivant pour l'année : FC-2026-0001, FC-2026-0002…
 * La numérotation repart à 1 chaque année.
 */
export function nextFileNumber(existing: string[], year: number): string {
  const maxThisYear = existing.reduce((max, value) => {
    const m = PATTERN.exec(value);
    if (!m || Number(m[1]) !== year) return max;
    return Math.max(max, Number(m[2]));
  }, 0);
  return `FC-${year}-${String(maxThisYear + 1).padStart(4, "0")}`;
}
