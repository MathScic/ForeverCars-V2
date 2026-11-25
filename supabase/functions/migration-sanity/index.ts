// Migration et synchronisation Sanity → Supabase, relançable sans doublon (fiches par slug, photos par chemin).
// Appel protégé : en-tête x-migration-key vérifié par la base (clé dans Vault, jamais dans le code).
//   ?action=rows  → fiches + lignes de photos (fiches retirées de Sanity masquées, photos retirées enlevées)
//   ?action=sync  → rows + copie des photos manquantes (30 max) : appelé toutes les 10 min par la base (pg_cron)
//   ?action=photos&offset=0&limit=6[&step=36][&missing=1] → copie en files parallèles (1600, 800, 480 px)
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { assignFileNumbers, mapPhotos, mapVehicle, QUERY, SIZES, sizedPath } from "./mapping.mjs";

const SANITY = "https://kh6xke8y.apicdn.sanity.io/v2024-01-01/data/query/production";
declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };
const BASE = Deno.env.get("SUPABASE_URL")!;
const db = createClient(BASE, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
type Photo = ReturnType<typeof mapPhotos>[number];
async function sanityDocs() {
  const res = await fetch(`${SANITY}?query=${encodeURIComponent(QUERY)}`);
  if (!res.ok) throw new Error(`Sanity a répondu ${res.status}`);
  return (await res.json()).result as Record<string, unknown>[];
}
const must = <T>({ data, error }: { data: T; error: unknown }) => { if (error) throw error; return data; };

async function migrateRows(docs: Record<string, unknown>[]) {
  const mapped = docs.map(mapVehicle);
  const existing = must(await db.from("vehicles").select("slug, file_number")) ?? [];
  const rows = assignFileNumbers(mapped.map((m) => m.row), existing);
  must(await db.from("vehicles").upsert(rows, { onConflict: "slug" }));
  const sanitySlugs = new Set(rows.map((r) => r.slug));
  // Fiche retirée de Sanity : masquée du site (repassée en brouillon), jamais supprimée.
  const gone = existing.map((v) => v.slug).filter((s) => !sanitySlugs.has(s));
  if (gone.length) must(await db.from("vehicles").update({ status: "draft" }).in("slug", gone).in("status", ["online", "reserved"]));
  const idOf = new Map((must(await db.from("vehicles").select("id, slug")) ?? []).map((v) => [v.slug, v.id]));
  const photos = docs.flatMap(mapPhotos).map((p) => ({ vehicle_id: idOf.get(p.slug), storage_path: p.path, position: p.position, width: p.width, height: p.height }));
  // Photos retirées ou déplacées dans Sanity : anciennes lignes enlevées d'abord (positions libérées).
  const wanted = new Set(photos.map((p) => p.storage_path));
  const stale = (must(await db.from("vehicle_photos").select("id, storage_path")) ?? []).filter((p) => !wanted.has(p.storage_path)).map((p) => p.id);
  for (let i = 0; i < stale.length; i += 200) must(await db.from("vehicle_photos").delete().in("id", stale.slice(i, i + 200)));
  // Par lots qui ne coupent jamais un véhicule en deux (ordre des photos cohérent à chaque envoi).
  let batch: typeof photos = [];
  const flush = async () => { if (batch.length) must(await db.from("vehicle_photos").upsert(batch, { onConflict: "storage_path" })); batch = []; };
  for (const [i, p] of photos.entries()) { batch.push(p); if (batch.length >= 400 && photos[i + 1]?.vehicle_id !== p.vehicle_id) await flush(); }
  await flush();
  return {
    vehicules: rows.length, photos: photos.length, masquees: gone.length, lignesPhotosRetirees: stale.length,
    ecarts: mapped.filter((m) => m.issues.length).map((m) => ({ slug: m.row.slug, ecarts: m.issues })),
  };
}

const exists = async (path: string) => (await fetch(`${BASE}/storage/v1/object/public/vehicle-photos/${path}`, { method: "HEAD" })).ok;
async function upload(path: string, body: Uint8Array) {
  for (let attempt = 1; ; attempt++) {
    const { error } = await db.storage.from("vehicle-photos").upload(path, body, { contentType: "image/webp", upsert: true, cacheControl: "31536000" });
    if (!error || attempt === 4) return error;
    await new Promise((r) => setTimeout(r, 500 * attempt)); // base occupée : on réessaie un peu plus tard
  }
}
async function copyOne(p: Photo, onlyMissing: boolean) {
  for (const [suffix, w, q] of SIZES) {
    const path = sizedPath(p.path, suffix);
    if (onlyMissing && (await exists(path))) continue;
    const res = await fetch(`${p.source}?w=${w}&fm=webp&q=${q}`);
    if (!res.ok) return `${path} : Sanity ${res.status}`;
    const error = await upload(path, new Uint8Array(await res.arrayBuffer()));
    if (error) return `${path} : ${error.message}`;
  }
  return null;
}
async function sync() {
  const docs = await sanityDocs();
  const report = await migrateRows(docs);
  const bySlugPath = new Map(docs.flatMap(mapPhotos).map((p) => [p.path, p]));
  const missing = (must(await db.rpc("missing_photo_paths", { lim: 30 })) ?? []) as string[];
  const errors = await Promise.all(missing.map((m) => (bySlugPath.has(m) ? copyOne(bySlugPath.get(m)!, true) : null)));
  return { ...report, photosCopiees: missing.length, erreurs: errors.filter(Boolean) };
}

Deno.serve(async (req) => {
  // La clé attendue est rangée dans Vault ; la base la vérifie (fonction migration_key_ok, réservée au serveur).
  const { data: ok } = await db.rpc("migration_key_ok", { k: req.headers.get("x-migration-key") ?? "" });
  if (ok !== true) return new Response("Non autorisé", { status: 401 });
  const url = new URL(req.url);
  try {
    const action = url.searchParams.get("action");
    if (action === "rows") return Response.json(await migrateRows(await sanityDocs()));
    if (action === "sync") return Response.json(await sync());
    if (action === "photos") {
      const offset = Number(url.searchParams.get("offset") ?? 0), step = Number(url.searchParams.get("step") ?? 0);
      const photos = (await sanityDocs()).flatMap(mapPhotos), only = url.searchParams.get("missing") === "1";
      const slice = photos.slice(offset, offset + Number(url.searchParams.get("limit") ?? 6));
      const errors = (await Promise.all(slice.map((p) => copyOne(p, only)))).filter(Boolean);
      if (step && offset + step < photos.length) {
        url.searchParams.set("offset", String(offset + step));
        // Adresse publique de la fonction (req.url est une adresse interne au serveur).
        EdgeRuntime.waitUntil(fetch(`${BASE}/functions/v1/migration-sanity?${url.searchParams}`, { method: "POST", headers: { "x-migration-key": req.headers.get("x-migration-key") ?? "" } }));
      }
      return Response.json({ total: photos.length, faites: Math.min(offset + slice.length, photos.length), erreurs: errors });
    }
    return Response.json({ erreur: "action inconnue" }, { status: 400 });
  } catch (e) {
    return Response.json({ erreur: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
});
