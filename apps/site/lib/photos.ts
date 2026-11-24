// Photos stockées dans Supabase (stockage public « vehicle-photos ») : 1600 px et miniature 480 px en WebP.
// Même interface que l'ancien constructeur d'URL Sanity (urlForImage(img).width(…).url()) : les composants ne changent pas.
import type { SanityImage } from "@/lib/types/vehicle";

// Lu directement (et non via lib/env) : ce fichier sert aussi dans le navigateur, où seules les
// variables NEXT_PUBLIC_ citées telles quelles sont remplacées à la construction.
const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vehicle-photos/`;

/** Adresse d'une photo : la miniature suffit jusqu'à 480 px de large, sinon la version 1600 px. */
export const photoUrl = (path: string, width = 1600) => BASE + (width <= 480 ? path.replace(/\.webp$/, "-480.webp") : path);

export function urlForImage(img: SanityImage | null | undefined) {
  const path = img?.asset?._id;
  if (!path) return null;
  let width = 1600;
  const chain = {
    width: (w: number) => ((width = w), chain),
    // Pas de recadrage ni de qualité à la volée : deux tailles préparées à la copie suffisent.
    height: (h?: number) => (void h, chain),
    quality: (q?: number) => (void q, chain),
    auto: (a?: string) => (void a, chain),
    fit: (f?: string) => (void f, chain),
    url: () => photoUrl(path, width),
  };
  return chain;
}
