import { describe, expect, it } from "vitest";
import { DOCS, docProgress, firstMissing } from "./catalog";

describe("pièces du dossier", () => {
  it("liste les 7 pièces : 4 à fournir, 3 à générer", () => {
    expect(DOCS).toHaveLength(7);
    expect(DOCS.filter((d) => d.kind === "file")).toHaveLength(4);
    expect(DOCS.filter((d) => d.kind === "gen").map((d) => d.id)).toEqual(["bdc", "cession", "facture"]);
  });

  it("compte les pièces prêtes, sans dossier = 0", () => {
    expect(docProgress(undefined)).toEqual({ done: 0, total: 7 });
    expect(docProgress({ cg: true, ct: false, bdc: true, inconnu: true })).toEqual({ done: 2, total: 7 });
  });

  it("trouve la première pièce à fournir qui manque", () => {
    expect(firstMissing({ cg: true })?.id).toBe("ct");
    expect(firstMissing({ cg: true, ct: true, nongage: true, factures: true })).toBeUndefined();
  });
});
