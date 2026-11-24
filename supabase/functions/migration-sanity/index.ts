// Migration Sanity → Supabase, relançable sans doublon (fiches mises à jour par leur slug, photos par leur chemin).
// Appel protégé : en-tête x-migration-key vérifié par la base (clé à usage unique dans Vault, jamais dans le code).
//   ?action=rows                     → véhicules + lignes de photos, avec rapport des écarts
//   ?action=photos&offset=0&limit=6[&step=36][&missing=1] → copie des photos (1600 px + miniature 480 px, WebP) ;
//     avec step, l'appel lance lui-même le suivant (offset + step) : quelques files en parallèle, sans saturer la base.
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { assignFileNumbers, mapPhotos, mapVehicle, QUERY, thumbPath } from "./mapping.mjs";

const SANITY = "https://kh6xke8y.apicdn.sanity.io/v2024-01-01/data/query/production";
declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };
const BASE = Deno.env.get("SUPABASE_URL")!;
const db = createClient(BASE, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

async function sanityDocs() {
  const res = await fetch(`${SANITY}?query=${encodeURIComponent(QUERY)}`);
  if (!res.ok) throw new Error(`Sanity a répondu ${res.status}`);
  return (await res.json()).result as Record<string, unknown>[];
}

async function migrateRows() {
  const docs = await sanityDocs();
  const mapped = docs.map(mapVehicle);
  const { data: existing, error: e0 } = await db.from("vehicles").select("slug, file_number");
  if (e0) throw e0;
  const rows = assignFileNumbers(mapped.map((m) => m.row), existing ?? []);
  const { error: e1 } = await db.from("vehicles").upsert(rows, { onConflict: "slug" });
  if (e1) throw e1;
  const { data: ids, error: e2 } = await db.from("vehicles").select("id, slug");
  if (e2) throw e2;
  const idOf = new Map((ids ?? []).map((v) => [v.slug, v.id]));
  const photos = docs.flatMap(mapPhotos).map((p) => ({ vehicle_id: idOf.get(p.slug), storage_path: p.path, position: p.position, width: p.width, height: p.height }));
  for (let i = 0; i < photos.length; i += 500) {
    const { error } = await db.from("vehicle_photos").upsert(photos.slice(i, i + 500), { onConflict: "storage_path" });
    if (error) throw error;
  }
  const sanitySlugs = new Set(rows.map((r) => r.slug));
  return {
    vehicules: rows.length, photos: photos.length,
    parStatut: rows.reduce((acc: Record<string, number>, r) => ((acc[r.status] = (acc[r.status] ?? 0) + 1), acc), {}),
    ecarts: mapped.filter((m) => m.issues.length).map((m) => ({ slug: m.row.slug, ecarts: m.issues })),
    titres: mapped.map((m) => ({ avant: m.before, apres: m.after })),
    plusDansSanity: (existing ?? []).map((v) => v.slug).filter((s) => !sanitySlugs.has(s)),
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

async function copyOne(p: ReturnType<typeof mapPhotos>[number], onlyMissing: boolean) {
  for (const [path, w, q] of [[p.path, 1600, 80], [thumbPath(p.path), 480, 72]] as const) {
    if (onlyMissing && (await exists(path))) continue;
    const res = await fetch(`${p.source}?w=${w}&fm=webp&q=${q}`);
    if (!res.ok) return `${path} : Sanity ${res.status}`;
    const error = await upload(path, new Uint8Array(await res.arrayBuffer()));
    if (error) return `${path} : ${error.message}`;
  }
  return null;
}

async function copyPhotos(offset: number, limit: number, onlyMissing: boolean) {
  const photos = (await sanityDocs()).flatMap(mapPhotos);
  const errors = (await Promise.all(photos.slice(offset, offset + limit).map((p) => copyOne(p, onlyMissing)))).filter(Boolean);
  return { total: photos.length, faites: Math.min(offset + limit, photos.length), erreurs: errors };
}

Deno.serve(async (req) => {
  // La clé attendue est rangée dans Vault ; la base la vérifie (fonction migration_key_ok, réservée au serveur).
  const { data: ok } = await db.rpc("migration_key_ok", { k: req.headers.get("x-migration-key") ?? "" });
  if (ok !== true) return new Response("Non autorisé", { status: 401 });
  const url = new URL(req.url);
  try {
    const action = url.searchParams.get("action");
    if (action === "rows") return Response.json(await migrateRows());
    if (action === "photos") {
      const offset = Number(url.searchParams.get("offset") ?? 0), step = Number(url.searchParams.get("step") ?? 0);
      const out = await copyPhotos(offset, Number(url.searchParams.get("limit") ?? 6), url.searchParams.get("missing") === "1");
      if (step && offset + step < out.total) {
        url.searchParams.set("offset", String(offset + step));
        // Adresse publique de la fonction (req.url est une adresse interne au serveur).
        const next = `${BASE}/functions/v1/migration-sanity?${url.searchParams}`;
        EdgeRuntime.waitUntil(fetch(next, { method: "POST", headers: { "x-migration-key": req.headers.get("x-migration-key") ?? "" } }));
      }
      return Response.json(out);
    }
    return Response.json({ erreur: "action inconnue" }, { status: 400 });
  } catch (e) {
    return Response.json({ erreur: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
});
