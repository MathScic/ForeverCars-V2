import { describe, expect, it } from "vitest";
import { generateDescription } from "./description";
import { nextFileNumber } from "./fileNumber";
import { estimateMarket } from "./marketEstimate";
import { findInDemoRegistry } from "./plateLookup";

const yaris = {
  brand: "Toyota", model: "Yaris", version: "Hybride 116h Iconic", year: 2022, mileage: 42500,
  fuel: "hybride" as const, gearbox: "automatique" as const, powerHp: 116, color: "Gris Platine",
  owners: 1, warrantyMonths: 12, equipment: ["Accès mains libres", "Caméra de recul"],
};

describe("nextFileNumber", () => {
  it("démarre à 0001 et suit le plus grand numéro de l'année", () => {
    expect(nextFileNumber([], 2026)).toBe("FC-2026-0001");
    expect(nextFileNumber(["FC-2026-0003", "FC-2026-0011", "FC-2025-0040"], 2026)).toBe("FC-2026-0012");
  });
  it("ignore les valeurs mal formées", () => {
    expect(nextFileNumber(["dossier 7", ""], 2026)).toBe("FC-2026-0001");
  });
});

describe("findInDemoRegistry", () => {
  it("retrouve une plaque connue, quelle que soit la casse", () => {
    expect(findInDemoRegistry(" gh-218-kt ")).toMatchObject({ brand: "Toyota", model: "Yaris" });
  });
  it("renvoie null pour une plaque inconnue", () => {
    expect(findInDemoRegistry("AA-000-AA")).toBeNull();
  });
});

describe("estimateMarket", () => {
  it("donne une fourchette cohérente arrondie à la centaine", () => {
    const e = estimateMarket(yaris, 2026)!;
    expect(e.low).toBeLessThan(e.suggested);
    expect(e.suggested).toBeLessThan(e.high);
    expect(e.low % 100).toBe(0);
    expect(e.high % 100).toBe(0);
  });
  it("baisse quand le kilométrage augmente", () => {
    const low = estimateMarket({ ...yaris, mileage: 20000 }, 2026)!;
    const high = estimateMarket({ ...yaris, mileage: 120000 }, 2026)!;
    expect(high.suggested).toBeLessThan(low.suggested);
  });
  it("ne propose rien sans marque, modèle ou puissance", () => {
    expect(estimateMarket({ ...yaris, brand: "" }, 2026)).toBeNull();
    expect(estimateMarket({ ...yaris, powerHp: 0 }, 2026)).toBeNull();
  });
});

describe("generateDescription", () => {
  it("rédige l'annonce dans le ton de la maquette", () => {
    expect(generateDescription(yaris)).toBe(
      "Toyota Yaris Hybride 116h Iconic de 2022, 42 500 km. Motorisation hybride de 116 ch, boîte automatique, teinte Gris Platine. Première main.\n\n" +
        "Équipements : Accès mains libres, Caméra de recul.\n\n" +
        "Véhicule contrôlé et préparé par notre atelier, vendu avec une garantie de 12 mois. Reprise de votre véhicule possible et financement sur demande. Venez l'essayer sur notre parc.",
    );
  });
  it("omet couleur, première main, équipements et garantie s'ils manquent", () => {
    const text = generateDescription({ ...yaris, color: "", owners: 2, equipment: [], warrantyMonths: 0 });
    expect(text).not.toMatch(/teinte|Première main|Équipements|garantie/);
  });
});
