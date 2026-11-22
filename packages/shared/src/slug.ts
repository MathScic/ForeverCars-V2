/**
 * Construit un slug d'URL à partir de plusieurs morceaux.
 * slugify("Peugeot", "2008 GT Line", 2021) → "peugeot-2008-gt-line-2021"
 */
export function slugify(...parts: Array<string | number>): string {
  return parts
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
