type WithImages = { images?: readonly unknown[] | null };
type BlurMeta = { lqip?: string } & Record<string, unknown>;
type BlurImage = { asset?: { metadata?: BlurMeta } & Record<string, unknown> } & Record<string, unknown>;

/** Copie de la photo sans son aperçu flou (lqip) ; le reste est conservé tel quel. */
function withoutBlur(img: unknown): unknown {
  const asset = (img as BlurImage | null)?.asset;
  if (!asset?.metadata?.lqip) return img;
  const metadata = { ...asset.metadata };
  delete metadata.lqip;
  return { ...(img as BlurImage), asset: { ...asset, metadata } };
}

/**
 * Ne garde l'aperçu flou (lqip, ~600 octets de base64) que sur la 1re photo de chaque véhicule.
 * Les listes (stock, vendus, vedette) envoyaient au navigateur ~700 Ko d'aperçus jamais affichés.
 */
export function keepCoverBlurOnly<T extends WithImages>(items: readonly T[]): T[] {
  return items.map((item) => {
    if (!item.images) return item;
    return { ...item, images: item.images.map((img, i) => (i === 0 ? img : withoutBlur(img))) } as T;
  });
}
