// Copie d'une photo Sanity dans le stockage Supabase, en 3 tailles (1600, 800, 480 px, WebP).
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.49.4";
import { mapPhotos, SIZES, sizedPath } from "./mapping.mjs";

type Photo = ReturnType<typeof mapPhotos>[number];

export function photoCopier(db: SupabaseClient, base: string) {
  const exists = async (path: string) => (await fetch(`${base}/storage/v1/object/public/vehicle-photos/${path}`, { method: "HEAD" })).ok;
  async function upload(path: string, body: Uint8Array) {
    for (let attempt = 1; ; attempt++) {
      const { error } = await db.storage.from("vehicle-photos").upload(path, body, { contentType: "image/webp", upsert: true, cacheControl: "31536000" });
      if (!error || attempt === 4) return error;
      await new Promise((r) => setTimeout(r, 500 * attempt)); // base occupée : on réessaie un peu plus tard
    }
  }
  /** null si tout est copié, sinon le message d'erreur. */
  return async function copyOne(p: Photo, onlyMissing: boolean) {
    for (const [suffix, w, q] of SIZES) {
      const path = sizedPath(p.path, suffix);
      if (onlyMissing && (await exists(path))) continue;
      const res = await fetch(`${p.source}?w=${w}&fm=webp&q=${q}`);
      if (!res.ok) return `${path} : Sanity ${res.status}`;
      const error = await upload(path, new Uint8Array(await res.arrayBuffer()));
      if (error) return `${path} : ${error.message}`;
    }
    return null;
  };
}
