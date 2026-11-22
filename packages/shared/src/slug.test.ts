import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("assemble marque, modèle et année", () => {
    expect(slugify("Peugeot", "2008 GT Line", 2021)).toBe("peugeot-2008-gt-line-2021");
  });
  it("retire les accents et la ponctuation", () => {
    expect(slugify("Citroën", "C3 (Feel) – Édition")).toBe("citroen-c3-feel-edition");
  });
  it("ne laisse pas de tiret en début, fin ou en double", () => {
    expect(slugify("  --Golf  8--  ")).toBe("golf-8");
  });
  it("renvoie une chaîne vide si rien d'exploitable", () => {
    expect(slugify("!!!")).toBe("");
  });
});
