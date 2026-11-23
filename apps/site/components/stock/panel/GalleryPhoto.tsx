import { urlForImage } from "@/sanity/lib/image";
import type { SanityImage } from "@/lib/types/vehicle";

const WIDTHS = [640, 960, 1400];

interface Props {
  image: SanityImage;
  alt: string;
  /** Photo affichée dès l'arrivée sur la page (fiche) : téléchargée en priorité. */
  priority?: boolean;
}

// Photo de galerie responsive : Sanity sert chaque largeur, le navigateur prend la plus petite utile
// (≈ 50 Ko sur téléphone au lieu de 100). next/image ne génère pas de srcset ici (images non optimisées).
export default function GalleryPhoto({ image, alt, priority = false }: Props) {
  const base = urlForImage(image);
  if (!base) return null;
  const lqip: string | undefined = image?.asset?.metadata?.lqip;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- srcset Sanity construit à la main
    <img
      src={base.width(1400).quality(85).url()}
      srcSet={WIDTHS.map((w) => `${base.width(w).quality(w > 960 ? 85 : 80).url()} ${w}w`).join(", ")}
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
