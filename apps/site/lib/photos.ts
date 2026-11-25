// Photos stockées dans Supabase (stockage public « vehicle-photos ») : 1600, 800 et 480 px en WebP.
// Même interface que l'ancien constructeur d'URL Sanity (urlForImage(img).width(…).url()) : les composants ne changent pas.
import type { SanityImage } from "@/lib/types/vehicle";

// Lu directement (et non via lib/env) : ce fichier sert aussi dans le navigateur, où seules les
// variables NEXT_PUBLIC_ citées telles quelles sont remplacées à la construction.
const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vehicle-photos/`;

/** Adresse d'une photo : la plus petite taille stockée qui couvre la largeur demandée (480, 800 ou 1600 px). */
export function photoUrl(path: string, width = 1600) {
  const suffix = width <= 480 ? "-480" : width <= 800 ? "-800" : "";
  return BASE + (suffix ? path.replace(/\.webp$/, `${suffix}.webp`) : path);
}

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
