import { describe, expect, it } from "vitest";
import { formatMileage, formatPrice } from "./format";

// Remplace les espaces insécables par des espaces simples pour des assertions lisibles.
const plain = (s: string) => s.replace(/[\u00a0\u202f]/g, " ");

describe("formatPrice", () => {
  it("formate en euros, sans centimes", () => {
    expect(plain(formatPrice(18990))).toBe("18 990 €");
  });
  it("arrondit les centimes", () => {
    expect(plain(formatPrice(12499.6))).toBe("12 500 €");
  });
  it("gère zéro", () => {
    expect(plain(formatPrice(0))).toBe("0 €");
  });
});

describe("formatMileage", () => {
  it("ajoute le séparateur de milliers et l'unité", () => {
    expect(plain(formatMileage(45000))).toBe("45 000 km");
  });
  it("garde l'unité insécable (pas de retour à la ligne avant km)", () => {
    expect(formatMileage(12)).toBe("12\u00a0km");
  });
});
