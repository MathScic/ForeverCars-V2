// Filigrane ForeverCars : le logo du site (blanc et orange) en bas à droite, avec une ombre douce
// pour rester lisible sur un mur clair. Même proportion sur les 3 tailles.
import sharp from "sharp";
import logo from "../../../resources/watermark.svg?raw";

const LOGO = { width: 764, height: 326 }; // taille du SVG source
const PAD = 24; // marge autour du logo pour l'ombre (en unités du SVG)
export const WATERMARK = { widthRatio: 0.16, marginRatio: 0.025, opacity: 0.85, minPhotoWidth: 300 };

// Contenu du logo sans sa balise <svg> (il n'a pas de viewBox) : on le replace dans un cadre à la bonne taille.
const body = logo.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const cache = new Map<number, { data: Buffer; width: number; height: number }>();

/** Image PNG du filigrane pour une photo de `photoWidth` px de large. */
export async function watermarkFor(photoWidth: number): Promise<{ data: Buffer; width: number; height: number }> {
  const width = Math.round(photoWidth * WATERMARK.widthRatio * ((LOGO.width + 2 * PAD) / LOGO.width));
  const hit = cache.get(width);
  if (hit) return hit;
  const height = Math.round((width * (LOGO.height + 2 * PAD)) / (LOGO.width + 2 * PAD));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}"
    viewBox="${-PAD} ${-PAD} ${LOGO.width + 2 * PAD} ${LOGO.height + 2 * PAD}">
    <defs><filter id="s" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="3" stdDeviation="7" flood-color="#000" flood-opacity="0.6"/></filter></defs>
    <g opacity="${WATERMARK.opacity}" filter="url(#s)">${body}</g></svg>`;
  const mark = { data: await sharp(Buffer.from(svg)).png().toBuffer(), width, height };
  cache.set(width, mark);
  return mark;
}
