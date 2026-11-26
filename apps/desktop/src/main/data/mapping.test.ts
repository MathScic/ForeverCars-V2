import { describe, expect, it } from "vitest";
import { photoUrl, rowToVehicle, statusRow, vehicleFields, type VehicleRowFull } from "./mapping";

const BASE = "https://x.supabase.co";
const row = {
  id: "v1", file_number: "FC-2026-0102", slug: "peugeot-208-2021", plate: null, vin: null, brand: "Peugeot", model: "208",
  version: "1.2 PureTech", year: 2021, first_registration: null, fuel: "essence", gearbox: "manuelle", body: "citadine",
  power_hp: null, fiscal_hp: null, color: "", critair: null, mileage: 30000, owners: null, warranty_months: 12, price: 14990,
  description: "Belle 208", description_is_auto: false, equipment: ["GPS"], status: "online", is_featured: true, is_new: false,
  published_at: "2026-11-01T10:00:00Z", sold_at: null, created_by: null, updated_by: null, created_at: "2026-10-30T10:00:00Z",
  updated_at: "2026-11-02T10:00:00Z", revision: 4,
  vehicle_photos: [
    { id: "p2", storage_path: "peugeot-208-2021/01-bbb.webp", position: 1 },
    { id: "p1", storage_path: "peugeot-208-2021/00-aaa.webp", position: 0 },
  ],
  vehicle_costs: { purchase_price: 11000, repair_cost: 350 },
  vehicle_documents: [{ doc_type: "carte_grise" }, { doc_type: "facture_vente" }],
} satisfies VehicleRowFull;

describe("rowToVehicle", () => {
  const v = rowToVehicle(row, BASE);
  it("photos dans l'ordre, en version 800 px", () => {
    expect(v.photos.map((p) => p.id)).toEqual(["p1", "p2"]);
    expect(v.photos[0]!.url).toBe(`${BASE}/storage/v1/object/public/vehicle-photos/peugeot-208-2021/00-aaa-800.webp`);
  });
  it("champs vides de la base → valeurs de l'app", () => {
    expect([v.plate, v.powerHp, v.owners, v.body]).toEqual(["", 0, 1, "citadine"]);
  });
  it("coûts internes lus quand l'admin y a accès, absents sinon", () => {
    expect([v.purchasePrice, v.repairCost]).toEqual([11000, 350]);
    const seller = rowToVehicle({ ...row, vehicle_costs: null }, BASE);
    expect([seller.purchasePrice, seller.repairCost]).toEqual([undefined, undefined]);
  });
  it("pièces du dossier déjà rangées, avec les identifiants de l'écran Documents", () => {
    expect(v.documents).toEqual({ cg: true, facture: true });
  });
  it("garde la version en base (conflits) et la date de publication", () => {
    expect([v.revision, v.publishedAt]).toEqual([4, "2026-11-01T10:00:00Z"]);
  });
});

describe("vehicleFields", () => {
  it("nettoie la saisie et respecte les contraintes de la base", () => {
    const f = vehicleFields({ ...rowToVehicle(row, BASE), plate: "  ", brand: " Peugeot ", powerHp: 0 });
    expect([f.plate, f.brand, f.power_hp]).toEqual([null, "Peugeot", null]);
    expect(f).not.toHaveProperty("status");
  });
});

describe("statusRow / photoUrl", () => {
  it("n'écrit que les champs changés", () => {
    expect(statusRow({ status: "sold", soldAt: "t", isFeatured: false })).toEqual({ status: "sold", sold_at: "t", is_featured: false });
  });
  it("taille demandée", () => expect(photoUrl(BASE, "a/b.webp", "-480")).toBe(`${BASE}/storage/v1/object/public/vehicle-photos/a/b-480.webp`));
});
