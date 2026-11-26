// Chemin de photo envoyé par le renderer : vérifié ici avant toute lecture (règle de sécurité de l'app).
import { statSync } from "node:fs";
import { basename, extname, win32 } from "node:path";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif", ".tif", ".tiff"]);
export const MAX_BYTES = 40 * 1024 * 1024;

type Stat = (path: string) => { isFile(): boolean; size: number };

/** Renvoie le chemin s'il désigne une photo locale de taille raisonnable ; sinon une erreur claire. */
export function checkPhotoPath(path: string, stat: Stat = statSync): string {
  const name = basename(path);
  if (!path || !(win32.isAbsolute(path) || path.startsWith("/"))) {
    throw new Error("Glissez les photos depuis l'Explorateur Windows (ou utilisez « Choisir des photos »).");
  }
  // Partage réseau : Windows enverrait l'identité de l'utilisateur au serveur distant.
  if (path.startsWith("\\\\") || path.startsWith("//")) throw new Error("Copiez d'abord les photos sur ce PC, puis glissez-les ici.");
  if (!IMAGE_EXT.has(extname(path).toLowerCase())) throw new Error(`${name} : ce n'est pas une photo (JPEG, PNG, WebP…).`);
  const info = stat(path);
  if (!info.isFile()) throw new Error(`${name} : ce n'est pas une photo.`);
  if (info.size > MAX_BYTES) throw new Error(`${name} : fichier trop lourd (40 Mo maximum).`);
  return path;
}
