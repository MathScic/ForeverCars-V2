import { describe, expect, it } from "vitest";
import { computeMargin } from "./margin";

describe("computeMargin", () => {
  it("soustrait achat et frais du prix de vente", () => {
    expect(computeMargin({ salePrice: 20000, purchasePrice: 16000, repairCost: 1000 })).toEqual({
      amount: 3000,
      rate: 0.15,
    });
  });
  it("considère les frais à zéro s'ils sont absents", () => {
    expect(computeMargin({ salePrice: 10000, purchasePrice: 9000 }).amount).toBe(1000);
  });
  it("accepte une marge négative", () => {
    expect(computeMargin({ salePrice: 8000, purchasePrice: 9000 })).toEqual({
      amount: -1000,
      rate: -0.125,
    });
  });
  it("renvoie un taux nul si le prix de vente est nul", () => {
    expect(computeMargin({ salePrice: 0, purchasePrice: 500 }).rate).toBe(0);
  });
});
