import { describe, expect, it } from "vitest";
import { assignFileNumbers, mapPhotos, mapVehicle, thumbPath } from "../../../supabase/functions/migration-sanity/mapping.mjs";

const doc = {
  _id: "a1", _createdAt: "2026-03-01T10:00:00Z", _updatedAt: "2026-09-20T10:00:00Z", brand: "BMW", model: "SERIE 3 320 D 190 LUXURY",
  slug: "bmw-serie-3", year: 2019, price: 16990, mileage: 120000, fuel: "diesel", transmission: "automatique", type: "berline",
  power: 190, description: "  Belle auto.  ", features: ["GPS", ""], status: "sold", isFeatured: true, soldDate: "2026-09-17",
  images: [{ id: "image-abcdef123456-5712x3213-jpg", url: "https://cdn/x.jpg", w: 5712, h: 3213 }],
};

describe("mapVehicle", () => {
  it("convertit statut, date de vente et champs", () => {
    const { row, issues } = mapVehicle(doc);
    expect(row).toMatchObject({ status: "sold", sold_at: "2026-09-17T12:00:00Z", is_featured: false, description: "Belle auto.", equipment: ["GPS"], power_hp: 190 });
    expect(issues).toEqual([]);
  });
  it("signale les écarts au lieu de bloquer", () => {
    const { row, issues } = mapVehicle({ ...doc, status: "available", power: 30, images: [], fuel: undefined });
    expect(row).toMatchObject({ status: "online", power_hp: null, fuel: "essence", sold_at: null });
    expect(issues).toEqual(["puissance douteuse (30)", "aucune photo", "énergie inconnue (vide)"]);
  });
});

describe("mapVehicle : puissance", () => {
  it("reprend la puissance du titre quand la fiche est mal saisie", () => {
    const { row, issues } = mapVehicle({ ...doc, model: "M2 COMPETITION 410CH", power: 30, status: "available" });
    expect(row.power_hp).toBe(410);
    expect(issues).toEqual(["puissance reprise du titre (30 → 410)"]);
  });
});

describe("mapPhotos", () => {
  it("redimensionne à 1600 px et donne un chemin stable", () => {
    const [p] = mapPhotos(doc);
    expect(p).toMatchObject({ width: 1600, height: 900, position: 0, path: "bmw-serie-3/00-abcdef1234.webp" });
    expect(thumbPath(p.path)).toBe("bmw-serie-3/00-abcdef1234-480.webp");
  });
});

describe("assignFileNumbers", () => {
  it("garde le n° existant et numérote les nouveaux à la suite", () => {
    const rows = [{ slug: "a", created_at: "2026-01-01" }, { slug: "b", created_at: "2025-06-01" }];
    const out = assignFileNumbers(rows, [{ slug: "a", file_number: "FC-2026-0007" }]);
    expect(out.map((r) => r.file_number)).toEqual(["FC-2026-0007", "FC-2025-0008"]);
  });
});
