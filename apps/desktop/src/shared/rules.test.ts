import { describe, expect, it } from "vitest";
import type { Vehicle } from "./model";
import { actionLabel, actionPatch, publishBlockers } from "./rules";

const NOW = "2026-11-25T10:00:00.000Z";
const v = (patch: Partial<Vehicle> = {}): Vehicle => ({
  id: "1", fileNumber: "FC-2026-0102", slug: "peugeot-208", plate: "", brand: "Peugeot", model: "208", version: "", year: 2021,
  fuel: "essence", gearbox: "manuelle", powerHp: 100, mileage: 30000, color: "", owners: 1, warrantyMonths: 12, price: 14990,
  description: "Très belle 208, entretien suivi au garage.", descriptionIsAuto: false, equipment: [], status: "draft",
  isFeatured: false, exportLeboncoin: false, exportLaCentrale: false, photos: [{ id: "p", url: "u", name: "1.jpg" }],
  createdAt: NOW, updatedAt: NOW, publishedAt: null, revision: 3, ...patch,
});

describe("publishBlockers", () => {
  it("rien ne manque : publiable", () => expect(publishBlockers(v())).toEqual([]));
  it("liste ce qui manque, dans l'ordre de l'assistant", () => {
    expect(publishBlockers(v({ photos: [], price: 0, description: "court" }))).toEqual([
      "au moins une photo", "un prix de vente", "une description de 20 caractères minimum",
    ]);
  });
});

describe("actionPatch", () => {
  it("publier : en ligne, date de première publication gardée", () => {
    expect(actionPatch(v(), "publish", NOW)).toEqual({ status: "online", publishedAt: NOW, soldAt: null });
    expect(actionPatch(v({ publishedAt: "2026-01-01T00:00:00Z" }), "publish", NOW).publishedAt).toBe("2026-01-01T00:00:00Z");
  });
  it("publier sans photo : refusé avec la raison", () => {
    expect(() => actionPatch(v({ photos: [] }), "publish", NOW)).toThrow("Pour publier, il manque : au moins une photo.");
  });
  it("vendu : date de vente, plus de coup de cœur", () => {
    expect(actionPatch(v({ status: "online", isFeatured: true }), "markSold", NOW)).toEqual({ status: "sold", soldAt: NOW, isFeatured: false });
  });
  it("réserver puis remettre en ligne ; impossible pour un brouillon", () => {
    expect(actionPatch(v({ status: "online" }), "toggleReserved", NOW)).toEqual({ status: "reserved" });
    expect(actionPatch(v({ status: "reserved" }), "toggleReserved", NOW)).toEqual({ status: "online" });
    expect(() => actionPatch(v(), "toggleReserved", NOW)).toThrow("Seul un véhicule visible sur le site peut être réservé.");
  });
  it("coup de cœur : bascule", () => {
    expect(actionPatch(v({ isFeatured: true }), "toggleFeatured", NOW)).toEqual({ isFeatured: false });
  });
  it("retirer du site : repasse en brouillon, sans coup de cœur ; refusé hors du site", () => {
    expect(actionPatch(v({ status: "online", isFeatured: true }), "unpublish", NOW)).toEqual({ status: "draft", isFeatured: false });
    expect(actionPatch(v({ status: "reserved" }), "unpublish", NOW)).toEqual({ status: "draft", isFeatured: false });
    expect(() => actionPatch(v({ status: "sold" }), "unpublish", NOW)).toThrow("Ce véhicule n'est pas affiché sur le site.");
  });
});

describe("actionLabel", () => {
  it("phrase du journal d'activité", () => {
    expect(actionLabel(v(), "publish")).toBe("Mis en ligne : Peugeot 208");
    expect(actionLabel(v({ status: "online" }), "toggleReserved")).toBe("Réservé : Peugeot 208");
    expect(actionLabel(v({ status: "reserved" }), "toggleReserved")).toBe("Remis en ligne : Peugeot 208");
    expect(actionLabel(v({ brand: "", model: "" }), "remove")).toBe("Supprimé : Véhicule sans nom");
    expect(actionLabel(v({ status: "online" }), "unpublish")).toBe("Retiré du site : Peugeot 208");
  });
});
