import { describe, expect, it } from "vitest";
import { splitTitle, word } from "../../../supabase/functions/migration-sanity/titles.mjs";

const split = (b, m) => { const t = splitTitle(b, m); return [t.brand, t.model, t.version]; };

describe("splitTitle : les vrais cas du stock Sanity", () => {
  it("sépare marque, modèle et version, en casse normale", () => {
    expect(split("AUDI", "A3 SPORTBACK 2.0 TDI 150")).toEqual(["Audi", "A3 Sportback", "2.0 TDI 150"]);
    expect(split("VOLKSWAGEN", "GOLF GTI TCR 290 DSG7")).toEqual(["Volkswagen", "Golf", "GTI TCR 290 DSG7"]);
    expect(split("MERCEDES", "CLASS A 200d 150 AMG-LINE PREMIUM PLUS")).toEqual(["Mercedes-Benz", "Classe A", "200d 150 AMG Line Premium Plus"]);
  });
  it("retire la marque répétée", () => {
    expect(split("VOLKSWAGEN", "VOLKSWAGEN GOLF 2.0 TDI 184CH FAP GTD")).toEqual(["Volkswagen", "Golf", "2.0 TDI 184 ch FAP GTD"]);
    expect(split("Audi", "AUDI A3 SPORTBACK 1.5 TFSI DSG7 ADVANCED")).toEqual(["Audi", "A3 Sportback", "1.5 TFSI DSG7 Advanced"]);
  });
  it("gère le titre complet saisi dans « marque »", () => {
    expect(split("SEAT ATECA 1.5 TSI 150 STYLE DSG7", "ATECA")).toEqual(["Seat", "Ateca", "1.5 TSI 150 Style DSG7"]);
  });
  it("coupe les mentions après « - » et lit la garantie", () => {
    const t = splitTitle("BMW", "335i HYBRIDE M SPORT 340 - Garantie 6 mois");
    expect([t.brand, t.model, t.version, t.warranty]).toEqual(["BMW", "335i", "Hybride M Sport 340", 6]);
  });
  it("comprend « Série 2 » et les codes moteur BMW", () => {
    expect(split("BMW", "SERIE 2 218D M SPORT DKG7")).toEqual(["BMW", "Série 2", "218d M Sport DKG7"]);
  });
  it("corrige les saisies ratées (faute, marque absente, e-208)", () => {
    expect(split("VOLLKSWAGEN", "POLO 1.2 TSI 110 SPORTLINE BVM6")).toEqual(["Volkswagen", "Polo", "1.2 TSI 110 Sportline BVM6"]);
    expect(split("C-HR 122H DISTINCTIVE 2WD E-CVT MY20 / Garantie 6 mois / carplay", "ch-r")).toEqual(["Toyota", "C-HR", "122h Distinctive 2WD e-CVT MY20"]);
    expect(split("PEUGEOT E 208 136 STYLE - Garantie 6 mois / CarPlay", "E-208")).toEqual(["Peugeot", "e-208", "136 Style"]);
  });
  it("signale une marque inconnue", () => {
    expect(splitTitle("BUGATTI", "CHIRON").known).toBe(false);
  });
});

describe("word", () => {
  it("garde les sigles et met le reste en casse normale", () => {
    expect(["TDI", "BLUEHDI", "I20", "XDRIVE", "ALLURE"].map(word)).toEqual(["TDI", "BlueHDi", "i20", "xDrive", "Allure"]);
  });
});
