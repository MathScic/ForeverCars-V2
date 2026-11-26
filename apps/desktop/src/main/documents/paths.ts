// Fichier de pièce (carte grise, CT…) envoyé par le renderer : vérifié ici avant toute lecture.
import { statSync } from "node:fs";
import { basename, extname, win32 } from "node:path";
import { DOC_EXTENSIONS } from "../../shared/documents";

export const DOC_MAX_BYTES = 20 * 1024 * 1024; // même limite que l'espace de stockage

type Stat = (path: string) => { isFile(): boolean; size: number };

export function checkDocumentPath(path: string, stat: Stat = statSync): { path: string; ext: string; mime: string } {
  const name = basename(path);
  if (!path || !(win32.isAbsolute(path) || path.startsWith("/"))) throw new Error("Choisissez le fichier sur ce PC (bouton « Ajouter »).");
  // Partage réseau : Windows enverrait l'identité de l'utilisateur au serveur distant.
  if (path.startsWith("\\\\") || path.startsWith("//")) throw new Error("Copiez d'abord le fichier sur ce PC, puis ajoutez-le.");
  const ext = extname(path).toLowerCase();
  const mime = DOC_EXTENSIONS[ext];
  if (!mime) throw new Error(`${name} : format non accepté (PDF, JPEG, PNG, WebP ou HEIC).`);
  const info = stat(path);
  if (!info.isFile()) throw new Error(`${name} : ce n'est pas un fichier.`);
  if (info.size > DOC_MAX_BYTES) throw new Error(`${name} : fichier trop lourd (20 Mo maximum).`);
  return { path, ext, mime };
}
