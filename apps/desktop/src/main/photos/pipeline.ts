// Traitement d'une photo sur le PC, avant envoi : redressée (EXIF), 3 tailles WebP, filigrane,
// et aucune métadonnée gardée (ni position GPS, ni modèle de téléphone).
import sharp from "sharp";
import { SIZES } from "./sizes";
import { WATERMARK, watermarkFor } from "./watermark";

export interface ProcessedPhoto {
  suffix: string;
  data: Buffer;
  width: number;
  height: number;
}

/** Dimensions à l'écran une fois la photo redressée (EXIF 5 à 8 : prise en portrait). */
export function orientedSize(m: { width?: number; height?: number; orientation?: number }) {
  const swap = (m.orientation ?? 1) >= 5;
  return { width: (swap ? m.height : m.width) ?? 0, height: (swap ? m.width : m.height) ?? 0 };
}

export async function processPhoto(input: Buffer): Promise<ProcessedPhoto[]> {
  const source = sharp(input, { failOn: "error" });
  const size = orientedSize(await source.metadata());
  if (!size.width || !size.height) throw new Error("Image illisible.");
  return Promise.all(
    SIZES.map(async ({ suffix, width: max, quality }) => {
      const width = Math.min(max, size.width); // jamais agrandie
      const height = Math.round((size.height * width) / size.width);
      const image = source.clone().rotate().resize({ width, height, fit: "fill" });
      if (width >= WATERMARK.minPhotoWidth) {
        const mark = await watermarkFor(width);
        const margin = Math.round(width * WATERMARK.marginRatio);
        image.composite([{ input: mark.data, left: width - mark.width - margin, top: height - mark.height - margin }]);
      }
      return { suffix, data: await image.webp({ quality }).toBuffer(), width, height };
    }),
  );
}
