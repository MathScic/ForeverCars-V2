import { urlForImage } from "@/lib/photos";
import type { SanityImage } from "@/lib/types/vehicle";

// Les 3 tailles réellement stockées dans Supabase : les largeurs annoncées collent aux fichiers.
const WIDTHS = [480, 800, 1600];

interface Props {
  image: SanityImage;
  alt: string;
  /** Photo affichée dès l'arrivée sur la page (fiche) : téléchargée en priorité. */
  priority?: boolean;
}

// Photo de galerie responsive : le navigateur prend la plus petite taille utile (800 px ≈ 55 Ko sur
// téléphone au lieu de 1600 px ≈ 150 Ko). next/image ne génère pas de srcset ici (images non optimisées).
export default function GalleryPhoto({ image, alt, priority = false }: Props) {
  const base = urlForImage(image);
  if (!base) return null;
  const lqip: string | undefined = image?.asset?.metadata?.lqip;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- srcset construit à la main (3 tailles stockées)
    <img
      src={base.width(1600).url()}
      srcSet={WIDTHS.map((w) => `${base.width(w).url()} ${w}w`).join(", ")}
      sizes="(min-width: 768px) 720px, 100vw"
      alt={alt}
      draggable={false}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      style={lqip ? { backgroundImage: `url("${lqip}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    />
  );
}
