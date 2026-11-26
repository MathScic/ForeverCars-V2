// Les 3 tailles stockées pour chaque photo, comme les photos venues de Sanity : le site choisit selon l'écran.
export const SIZES = [
  { suffix: "", width: 1600, quality: 80 }, // fiche véhicule (chemin de base)
  { suffix: "-800", width: 800, quality: 78 }, // cartes du site et de l'app
  { suffix: "-480", width: 480, quality: 72 }, // miniatures, téléphone
] as const;

export const sizedPath = (path: string, suffix: string) => (suffix ? path.replace(/\.webp$/, `${suffix}.webp`) : path);

/** Les 3 fichiers d'une photo (pour les effacer ensemble). */
export const sizedPaths = (path: string) => SIZES.map((s) => sizedPath(path, s.suffix));
