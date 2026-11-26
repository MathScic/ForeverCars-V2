// Migration et synchronisation Sanity → Supabase, relançable sans doublon (fiches par slug, photos par chemin).
// Appel protégé : en-tête x-migration-key vérifié par la base (clé dans Vault, jamais dans le code).
//   ?action=rows  → fiches + lignes de photos (fiches retirées de Sanity masquées, photos retirées enlevées)
//   ?action=sync  → rows + copie des photos manquantes (30 max) : appelé toutes les 10 min par la base (pg_cron)
//   ?action=photos&offset=0&limit=6[&step=36][&missing=1] → copie en files parallèles (1600, 800, 480 px)
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { assignFileNumbers, mapPhotos, mapVehicle, QUERY } from "./mapping.mjs";
import { photoCopier } from "./copy.ts";
import { sanityScope } from "./ownership.mjs";

const SANITY = "https://kh6xke8y.apicdn.sanity.io/v2024-01-01/data/query/production";
declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };
const BASE = Deno.env.get("SUPABASE_URL")!;
const db = createClient(BASE, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const copyOne = photoCopier(db, BASE);
async function sanityDocs() {
  const res = await fetch(`${SANITY}?query=${encodeURIComponent(QUERY)}`);
  if (!res.ok) throw new Error(`Sanity a répondu ${res.status}`);
  return (await res.json()).result as Record<string, unknown>[];
}
const must = <T>({ data, error }: { data: T; error: unknown }) => { if (error) throw error; return data; };
// L'API renvoie 1 000 lignes au plus par appel : les photos (plus de 2 500) sont lues par pages.
async function allPhotoRows() {
  const out: { id: string; storage_path: string; vehicle_id: string }[] = [];
  for (let from = 0; ; from += 1000) {
    const page = must(await db.from("vehicle_photos").select("id, storage_path, vehicle_id").order("id").range(from, from + 999)) ?? [];
    out.push(...page);
    if (page.length < 1000) return out;
  }
}

async function migrateRows(docs: Record<string, unknown>[]) {
  const mapped = docs.map(mapVehicle);
  const existing = must(await db.from("vehicles").select("slug, file_number, created_by, updated_by")) ?? [];
  // Fiches créées ou modifiées dans l'app : plus touchées par la synchro (voir ownership.mjs).
  const scope = sanityScope(existing, assignFileNumbers(mapped.map((m) => m.row), existing));
  must(await db.from("vehicles").upsert(scope.rows, { onConflict: "slug" }));
  // Fiche retirée de Sanity : masquée du site (repassée en brouillon), jamais supprimée.
  if (scope.gone.length) must(await db.from("vehicles").update({ status: "draft" }).in("slug", scope.gone).in("status", ["online", "reserved"]));
  const ids = must(await db.from("vehicles").select("id, slug")) ?? [];
  const idOf = new Map(ids.map((v) => [v.slug, v.id]));
  const appIds = new Set(ids.filter((v) => scope.owned.has(v.slug)).map((v) => v.id));
  const photos = docs.flatMap(mapPhotos).filter((p) => !scope.owned.has(p.slug))
    .map((p) => ({ vehicle_id: idOf.get(p.slug), storage_path: p.path, position: p.position, width: p.width, height: p.height }));
  // Photos retirées ou déplacées dans Sanity : anciennes lignes enlevées d'abord (positions libérées). Jamais celles de l'app.
  const wanted = new Set(photos.map((p) => p.storage_path));
  const stale = (await allPhotoRows()).filter((p) => !appIds.has(p.vehicle_id) && !wanted.has(p.storage_path)).map((p) => p.id);
  for (let i = 0; i < stale.length; i += 200) must(await db.from("vehicle_photos").delete().in("id", stale.slice(i, i + 200)));
  // Par lots qui ne coupent jamais un véhicule en deux (ordre des photos cohérent à chaque envoi).
  let batch: typeof photos = [];
  const flush = async () => { if (batch.length) must(await db.from("vehicle_photos").upsert(batch, { onConflict: "storage_path" })); batch = []; };
  for (const [i, p] of photos.entries()) { batch.push(p); if (batch.length >= 400 && photos[i + 1]?.vehicle_id !== p.vehicle_id) await flush(); }
  await flush();
  return {
    vehicules: scope.rows.length, gereesParApp: scope.owned.size, photos: photos.length, masquees: scope.gone.length, lignesPhotosRetirees: stale.length,
    ecarts: mapped.filter((m) => m.issues.length).map((m) => ({ slug: m.row.slug, ecarts: m.issues })),
  };
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
