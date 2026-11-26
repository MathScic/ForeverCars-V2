// Photos d'un véhicule : traitement sur ce PC, envoi des 3 tailles, puis ligne en base (ordre géré par la base).
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import type { Photo } from "../../shared/model";
import { PHOTO_BUCKET, SUPABASE_URL } from "../config";
import { photoUrl } from "../data/mapping";
import { friendly } from "../errors";
import { db } from "../supabase/client";
import { checkPhotoPath } from "./paths";
import { processPhoto, type ProcessedPhoto } from "./pipeline";
import { sizedPath, sizedPaths } from "./sizes";

async function upload(path: string, data: Buffer): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    const { error } = await db().storage.from(PHOTO_BUCKET).upload(path, data, { contentType: "image/webp", cacheControl: "31536000" });
    if (!error) return;
    if (attempt === 3) throw friendly(error, "Envoi de la photo impossible");
    await new Promise((r) => setTimeout(r, 600 * attempt)); // réseau occupé : on réessaie un peu plus tard
  }
}

export async function addPhoto(vehicleId: string, rawPath: string): Promise<Photo> {
  const path = checkPhotoPath(rawPath);
  let sizes: ProcessedPhoto[];
  try {
    sizes = await processPhoto(await readFile(path));
  } catch {
    throw new Error(`${basename(path)} : image illisible (une photo HEIC d'iPhone doit d'abord être enregistrée en JPEG).`);
  }
  const base = `${vehicleId}/${randomUUID()}.webp`;
  const sent: string[] = [];
  try {
    // Les 3 tailles d'abord, la ligne ensuite : le site ne voit jamais une photo à moitié envoyée.
    for (const s of sizes) {
      await upload(sizedPath(base, s.suffix), s.data);
      sent.push(sizedPath(base, s.suffix));
    }
    const full = sizes[0]!;
    const { data, error } = await db().rpc("add_vehicle_photo", { p_vehicle: vehicleId, p_path: base, p_width: full.width, p_height: full.height });
    if (error || !data) throw friendly(error, "Photo non enregistrée");
    return { id: data.id, url: photoUrl(SUPABASE_URL, base), name: basename(path) };
  } catch (e) {
    if (sent.length) await db().storage.from(PHOTO_BUCKET).remove(sent); // pas de fichier orphelin
    throw e;
  }
}

/** Ordre voulu (la 1re est la couverture) ; les photos retirées sont effacées du stockage. */
export async function orderPhotos(vehicleId: string, ids: string[]): Promise<void> {
  const { data, error } = await db().rpc("set_vehicle_photos", { p_vehicle: vehicleId, p_ids: ids });
  if (error) throw friendly(error, "Ordre des photos non enregistré");
  const files = (data ?? []).flatMap(sizedPaths);
  if (files.length) await db().storage.from(PHOTO_BUCKET).remove(files);
}
