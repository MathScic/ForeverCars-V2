import { describe, expect, it } from "vitest";
import { toSiteVehicle, type VehicleRow } from "./site-vehicle";

const NOW = Date.parse("2026-11-24T12:00:00Z");
const row: VehicleRow = {
  id: "v1", slug: "volkswagen-golf-gti", brand: "Volkswagen", model: "Golf", version: "GTI TCR 290 DSG7", year: 2019,
  price: 28990, mileage: 72000, fuel: "essence", gearbox: "automatique", body: null, power_hp: 290, description: "Belle.",
  equipment: ["GPS"], status: "online", is_featured: true, published_at: "2026-11-20T10:00:00Z", sold_at: null,
  created_at: "2026-11-20T10:00:00Z",
  vehicle_photos: [
    { storage_path: "golf/01-b.webp", position: 1, width: 1600, height: 900 },
    { storage_path: "golf/00-a.webp", position: 0, width: 1600, height: 900 },
  ],
};

describe("toSiteVehicle", () => {
  it("donne au site la même forme qu'avant (titre, statut, photos dans l'ordre)", () => {
    const v = toSiteVehicle(row, NOW);
    expect(v).toMatchObject({ _id: "v1", model: "Golf GTI TCR 290 DSG7", status: "available", type: "berline", power: 290, transmission: "automatique" });
    expect(v.images.map((i) => i.asset._id)).toEqual(["golf/00-a.webp", "golf/01-b.webp"]);
    expect(v.images[0].asset.metadata?.dimensions).toEqual({ width: 1600, height: 900 });
  });
  it("calcule le badge « Nouveau » : moins de 7 jours en ligne", () => {
    expect(toSiteVehicle(row, NOW).isNew).toBe(true);
    expect(toSiteVehicle({ ...row, published_at: "2026-11-01T10:00:00Z" }, NOW).isNew).toBe(false);
  });
  it("garde la date de vente au format jour pour la page Vendu", () => {
    const v = toSiteVehicle({ ...row, status: "sold", sold_at: "2026-09-17T12:00:00+00:00" }, NOW);
    expect([v.status, v.soldDate]).toEqual(["sold", "2026-09-17"]);
  });
});
