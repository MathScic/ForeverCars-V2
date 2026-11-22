import { describe, expect, it } from "vitest";
import { emptyVehicle, finalize, normalizePlate, validateStep } from "./draft";

const now = "2026-11-22T10:00:00.000Z";
const filled = () => ({
  ...emptyVehicle("v1", now, "FC-2026-0001"),
  plate: "FX-482-KM",
  brand: "Peugeot",
  model: "2008",
  version: "GT Line",
  year: 2021,
  powerHp: 130,
  mileage: 38500,
});

describe("normalizePlate", () => {
  it("met au format SIV", () => {
    expect(normalizePlate("fx 482km")).toBe("FX-482-KM");
    expect(normalizePlate("FX-482-KM")).toBe("FX-482-KM");
  });
  it("laisse une saisie incomplète en majuscules", () => {
    expect(normalizePlate("fx-48")).toBe("FX-48");
  });
});

describe("validateStep", () => {
  it("étape Véhicule : marque, modèle et puissance obligatoires", () => {
    const errors = validateStep(0, emptyVehicle("v1", now, "FC-2026-0001"), new Date(now));
    expect(Object.keys(errors).sort()).toEqual(["brand", "model", "powerHp"]);
  });
  it("étape Identification : numéro de dossier obligatoire", () => {
    expect(validateStep(0, { ...filled(), fileNumber: " " }, new Date(now)).fileNumber).toBeDefined();
  });
  it("étape Véhicule : plaque mal formée refusée, plaque vide acceptée", () => {
    expect(validateStep(0, { ...filled(), plate: "123" }, new Date(now)).plate).toBeDefined();
    expect(validateStep(0, { ...filled(), plate: "" }, new Date(now))).toEqual({});
  });
  it("étape Véhicule : année hors bornes refusée", () => {
    expect(validateStep(0, { ...filled(), year: 1989 }, new Date(now)).year).toBeDefined();
    expect(validateStep(0, { ...filled(), year: 2028 }, new Date(now)).year).toBeDefined();
    expect(validateStep(0, { ...filled(), year: 2027 }, new Date(now))).toEqual({});
  });
  it("étape Photos : au moins une photo", () => {
    expect(validateStep(1, filled()).photos).toBe("Ajoutez au moins une photo");
    const withPhoto = { ...filled(), photos: [{ id: "p", url: "x", name: "x.jpg" }] };
    expect(validateStep(1, withPhoto)).toEqual({});
  });
  it("étape Prix : prix positif et description de 20 caractères", () => {
    const errors = validateStep(2, { ...filled(), description: "Trop court" });
    expect(Object.keys(errors).sort()).toEqual(["description", "price"]);
  });
  it("étape Aperçu : rien à valider", () => {
    expect(validateStep(3, emptyVehicle("v1", now, "FC-2026-0001"))).toEqual({});
  });
});

describe("finalize", () => {
  it("calcule le slug à partir de la fiche", () => {
    expect(finalize(filled()).slug).toBe("peugeot-2008-gt-line-2021");
  });
});
