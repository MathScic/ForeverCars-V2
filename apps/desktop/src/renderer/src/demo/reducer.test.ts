import { describe, expect, it } from "vitest";
import { demoReducer } from "./reducer";
import { createSeedState } from "./seed";

const now = "2026-11-22T10:00:00.000Z";
const byId = (s: ReturnType<typeof createSeedState>, id: string) => s.vehicles.find((v) => v.id === id)!;

describe("demoReducer", () => {
  it("publie un brouillon et journalise l'action", () => {
    const s = demoReducer(createSeedState(), { type: "publish", id: "demo-4", now });
    expect(byId(s, "demo-4").status).toBe("online");
    expect(byId(s, "demo-4").updatedAt).toBe(now);
    expect(s.activity[0]).toMatchObject({ at: now, actor: "Clément", label: "Mis en ligne : Renault Clio 5" });
  });

  it("marque vendu : date de vente et retrait des coups de cœur", () => {
    const s = demoReducer(createSeedState(), { type: "markSold", id: "demo-1", now });
    expect(byId(s, "demo-1")).toMatchObject({ status: "sold", soldAt: now, isFeatured: false });
  });

  it("réserve un véhicule en ligne puis le remet en ligne", () => {
    const reserved = demoReducer(createSeedState(), { type: "toggleReserved", id: "demo-1", now });
    expect(byId(reserved, "demo-1").status).toBe("reserved");
    expect(reserved.activity[0]!.label).toBe("Réservé : Peugeot 2008");
    const back = demoReducer(reserved, { type: "toggleReserved", id: "demo-1", now });
    expect(byId(back, "demo-1").status).toBe("online");
    expect(back.activity[0]!.label).toBe("Remis en ligne : Peugeot 2008");
  });

  it("ne réserve ni un brouillon ni un véhicule vendu", () => {
    const seed = createSeedState();
    expect(demoReducer(seed, { type: "toggleReserved", id: "demo-4", now })).toBe(seed);
    expect(demoReducer(seed, { type: "toggleReserved", id: "demo-5", now })).toBe(seed);
  });

  it("enregistre une pièce du dossier puis la retire", () => {
    const added = demoReducer(createSeedState(), { type: "setDocument", id: "demo-2", doc: "cg", done: true, now });
    expect(byId(added, "demo-2").documents).toEqual({ cg: true });
    expect(added.activity[0]!.label).toBe("Dossier Volkswagen Golf 8 : Carte grise (certificat d'immatriculation)");
    const removed = demoReducer(added, { type: "setDocument", id: "demo-2", doc: "cg", done: false, now });
    expect(byId(removed, "demo-2").documents).toEqual({ cg: false });
    expect(removed.activity).toHaveLength(added.activity.length); // un retrait n'est pas journalisé
  });

  it("bascule le coup de cœur dans les deux sens", () => {
    const once = demoReducer(createSeedState(), { type: "toggleFeatured", id: "demo-2", now });
    expect(byId(once, "demo-2").isFeatured).toBe(true);
    const twice = demoReducer(once, { type: "toggleFeatured", id: "demo-2", now });
    expect(byId(twice, "demo-2").isFeatured).toBe(false);
  });

  it("crée puis modifie un véhicule sans doublon", () => {
    const seed = createSeedState();
    const draft = { ...byId(seed, "demo-1"), id: "new-1", brand: "Audi", model: "A3" };
    const created = demoReducer(seed, { type: "save", vehicle: draft, now });
    expect(created.vehicles).toHaveLength(seed.vehicles.length + 1);
    expect(created.activity[0]!.label).toBe("Brouillon créé : Audi A3");
    const edited = demoReducer(created, { type: "save", vehicle: { ...draft, price: 1 }, now });
    expect(edited.vehicles).toHaveLength(created.vehicles.length);
    expect(byId(edited, "new-1").price).toBe(1);
    expect(edited.activity[0]!.label).toBe("Modifié : Audi A3");
  });

  it("attribue l'action au vendeur quand le rôle est seller", () => {
    const seller = demoReducer(createSeedState(), { type: "setRole", role: "seller" });
    const s = demoReducer(seller, { type: "markSold", id: "demo-2", now });
    expect(s.activity[0]!.actor).toBe("Vendeur");
  });

  it("ignore une action sur un véhicule inconnu", () => {
    const seed = createSeedState();
    expect(demoReducer(seed, { type: "remove", id: "absent", now })).toBe(seed);
  });
});
