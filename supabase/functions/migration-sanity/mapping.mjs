// Correspondance Sanity → Supabase (véhicules et photos). Code pur, partagé par la fonction de migration et ses tests.
import { splitTitle } from "./titles.mjs";

export const QUERY = `*[_type == "vehicle" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
  _id, _createdAt, _updatedAt, brand, model, "slug": slug.current, year, price, mileage, fuel, transmission, type, power,
  description, features, status, isFeatured, soldDate,
  "images": images[]{ "id": asset->_id, "url": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height } }`;

const STATUS = { available: "online", reserved: "reserved", sold: "sold" };
const FUELS = ["essence", "diesel", "hybride", "electrique"];
const BODIES = ["berline", "suv", "coupe", "break", "citadine", "utilitaire", "cabriolet", "monospace"];
export const MAX_W = 1600;

/** Une fiche Sanity → une ligne `vehicles` (sans n° de dossier, attribué à l'insertion) + les écarts à signaler. */
export function mapVehicle(doc) {
  const t = splitTitle(doc.brand, doc.model);
  const status = STATUS[doc.status] ?? "draft";
  const issues = [];
  if (!t.known) issues.push("marque non reconnue");
  // Puissance mal saisie (ex. 30 au lieu de 410) : on reprend celle du titre (« 410ch ») si elle y est.
  const fromTitle = Number((`${doc.brand} ${doc.model}`.match(/(\d{2,3})\s*ch\b/i) || [])[1]) || null;
  const power = doc.power >= 40 ? doc.power : fromTitle;
  if (!(doc.power >= 40)) issues.push(fromTitle ? `puissance reprise du titre (${doc.power ?? "vide"} → ${fromTitle})` : `puissance douteuse (${doc.power ?? "vide"})`);
  if (!doc.year) issues.push("année manquante");
  if (status === "sold" && !doc.soldDate) issues.push("vendu sans date de vente");
  if (!doc.images?.length) issues.push("aucune photo");
  if (!FUELS.includes(doc.fuel)) issues.push(`énergie inconnue (${doc.fuel ?? "vide"})`);
  if (!["manuelle", "automatique"].includes(doc.transmission)) issues.push(`boîte inconnue (${doc.transmission ?? "vide"})`);
  const row = {
    slug: doc.slug, brand: t.brand, model: t.model || "?", version: t.version, year: doc.year || 2000,
    fuel: FUELS.includes(doc.fuel) ? doc.fuel : "essence", gearbox: doc.transmission === "manuelle" ? "manuelle" : "automatique",
    body: BODIES.includes(doc.type) ? doc.type : null, power_hp: power >= 40 ? Math.round(power) : null,
    mileage: Math.max(0, Math.round(doc.mileage ?? 0)), price: Math.max(0, doc.price ?? 0), warranty_months: t.warranty ?? 12,
    description: String(doc.description ?? "").trim(), description_is_auto: false, equipment: (doc.features ?? []).filter(Boolean),
    status, is_featured: !!doc.isFeatured && status !== "sold", is_new: false,
    published_at: doc._createdAt, sold_at: status === "sold" ? (doc.soldDate ? `${doc.soldDate}T12:00:00Z` : doc._updatedAt) : null,
    created_at: doc._createdAt, updated_at: doc._updatedAt,
  };
  return { row, issues, before: `${doc.brand ?? ""} | ${doc.model ?? ""}`, after: `${t.brand} | ${t.model} | ${t.version}` };
}

/** Photos : 1600 px max en WebP + miniature 480 px ; chemin stable (relançable sans doublon). */
export function mapPhotos(doc) {
  return (doc.images ?? []).filter((i) => i?.url).map((img, position) => {
    const width = Math.min(MAX_W, img.w || MAX_W);
    const height = img.w && img.h ? Math.round((img.h * width) / img.w) : null;
    const hash = String(img.id || img.url).replace(/^image-/, "").slice(0, 10);
    return { slug: doc.slug, position, source: img.url, width, height, path: `${doc.slug}/${String(position).padStart(2, "0")}-${hash}.webp` };
  });
}
export const thumbPath = (path) => path.replace(/\.webp$/, "-480.webp");

/** N° de dossier : celui déjà attribué, sinon le suivant (FC-<année de création>-0001…). */
export function assignFileNumbers(rows, existing) {
  const known = new Map(existing.map((v) => [v.slug, v.file_number]));
  let next = existing.reduce((m, v) => Math.max(m, Number(String(v.file_number).slice(-4)) || 0), 0);
  return rows.map((r) => ({ ...r, file_number: known.get(r.slug) ?? `FC-${r.created_at.slice(0, 4)}-${String(++next).padStart(4, "0")}` }));
}
