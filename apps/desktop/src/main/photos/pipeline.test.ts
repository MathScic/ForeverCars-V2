import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { orientedSize, processPhoto } from "./pipeline";

const BLUE = "#3a6ea5"; // fond uni : le blanc du logo s'y repère facilement
const photo = (width: number, height: number, orientation = 1) =>
  sharp({ create: { width, height, channels: 3, background: BLUE } }).jpeg().withMetadata({ orientation }).toBuffer();
// stats() mesure l'image d'entrée : on découpe d'abord la zone, puis on la mesure.
const maxRed = async (img: Buffer, left: number, top: number, w: number, h: number) =>
  (await sharp(await sharp(img).extract({ left, top, width: w, height: h }).toBuffer()).stats()).channels[0]!.max;

describe("orientedSize", () => {
  it("échange largeur et hauteur pour une photo prise en portrait (EXIF 5 à 8)", () => {
    expect(orientedSize({ width: 4000, height: 3000, orientation: 6 })).toEqual({ width: 3000, height: 4000 });
    expect(orientedSize({ width: 4000, height: 3000 })).toEqual({ width: 4000, height: 3000 });
  });
});

describe("processPhoto", () => {
  it("3 tailles WebP, redressées, sans agrandir ni garder les métadonnées", async () => {
    const out = await processPhoto(await photo(3000, 2000, 6));
    expect(out.map((o) => [o.suffix, o.width, o.height])).toEqual([["", 1600, 2400], ["-800", 800, 1200], ["-480", 480, 720]]);
    const meta = await sharp(out[0]!.data).metadata();
    expect([meta.format, meta.width, meta.height, meta.exif, meta.orientation]).toEqual(["webp", 1600, 2400, undefined, undefined]);
  });

  it("une petite photo n'est pas agrandie", async () => {
    const out = await processPhoto(await photo(900, 600));
    expect(out.map((o) => o.width)).toEqual([900, 800, 480]);
  });

  it("filigrane en bas à droite, rien en haut à gauche", async () => {
    const [full] = await processPhoto(await photo(2400, 1600));
    expect(await maxRed(full!.data, 1600 - 260, 1067 - 110, 220, 80)).toBeGreaterThan(200);
    expect(await maxRed(full!.data, 20, 20, 220, 80)).toBeLessThan(90);
  });

  it("poids raisonnable pour le site", async () => {
    const out = await processPhoto(await photo(4000, 3000));
    expect(out[0]!.data.length).toBeLessThan(400_000);
  });

  it("fichier qui n'est pas une image : erreur", async () => {
    await expect(processPhoto(Buffer.from("pas une image"))).rejects.toThrow();
  });
});
