import { describe, expect, it } from "vitest";
import type { DemoVehicle } from "../demo/types";
import { averageMarginRate, averageSaleDays, daysInStock, dormantCount, marginTotal, periodStart, salesByMonth, soldBetween, stockAgeBuckets, topBrands } from "./stats";

const NOW = Date.parse("2026-11-23T12:00:00.000Z");
const iso = (daysAgo: number) => new Date(NOW - daysAgo * 86_400_000).toISOString();
const v = (p: Partial<DemoVehicle>): DemoVehicle =>
  ({ id: "x", brand: "Audi", model: "A3", status: "online", price: 10000, createdAt: iso(10), photos: [], ...p }) as DemoVehicle;

describe("stats du parc", () => {
  it("compte les jours en stock, arrêtés à la date de vente", () => {
    expect(daysInStock(v({ createdAt: iso(12) }), NOW)).toBe(12);
    expect(daysInStock(v({ status: "sold", createdAt: iso(40), soldAt: iso(10) }), NOW)).toBe(30);
  });

  it("stock dormant : en ligne ou réservé depuis plus de 60 jours", () => {
    const parc = [v({ createdAt: iso(61) }), v({ status: "reserved", createdAt: iso(90) }), v({ createdAt: iso(60) }), v({ status: "draft", createdAt: iso(99) }), v({ status: "sold", createdAt: iso(99), soldAt: iso(1) })];
    expect(dormantCount(parc, NOW)).toBe(2);
  });

  it("délai moyen de vente, ou null sans vente", () => {
    expect(averageSaleDays([v({ status: "sold", createdAt: iso(40), soldAt: iso(10) }), v({ status: "sold", createdAt: iso(20), soldAt: iso(10) })])).toBe(20);
    expect(averageSaleDays([v({})])).toBeNull();
  });

  it("ventes par mois sur les N derniers mois, du plus ancien au plus récent", () => {
    const parc = [v({ status: "sold", soldAt: "2026-11-02T10:00:00.000Z" }), v({ status: "sold", soldAt: "2026-11-20T10:00:00.000Z" }), v({ status: "sold", soldAt: "2026-09-15T10:00:00.000Z" })];
    const months = salesByMonth(parc, NOW, 3);
    expect(months.map((m) => m.count)).toEqual([1, 0, 2]);
    expect(months.map((m) => m.label)).toEqual(["sept.", "oct.", "nov."]);
  });

  it("ventes d'une période et marge totale (prix d'achat connu uniquement)", () => {
    const parc = [
      v({ status: "sold", soldAt: iso(5), price: 20000, purchasePrice: 15000, repairCost: 1000 }),
      v({ status: "sold", soldAt: iso(6), price: 12000 }),
      v({ status: "sold", soldAt: iso(70), price: 9000, purchasePrice: 5000 }),
    ];
    const recent = soldBetween(parc, NOW - 30 * 86_400_000, NOW);
    expect(recent).toHaveLength(2);
    expect(marginTotal(recent)).toBe(4000);
  });

  it("taux de marge moyen sur les véhicules au prix d'achat connu, ou null", () => {
    const parc = [v({ price: 20000, purchasePrice: 16000 }), v({ price: 10000, purchasePrice: 9000, repairCost: 0 }), v({ price: 5000 })];
    expect(averageMarginRate(parc)).toBeCloseTo(0.15);
    expect(averageMarginRate([v({})])).toBeNull();
  });

  it("ancienneté du stock en 4 tranches", () => {
    const parc = [v({ createdAt: iso(5) }), v({ createdAt: iso(45) }), v({ createdAt: iso(75) }), v({ createdAt: iso(120) }), v({ createdAt: iso(200) })];
    expect(stockAgeBuckets(parc, NOW).map((b) => b.count)).toEqual([1, 1, 1, 2]);
  });

  it("début de période : 1er du mois en cours, il y a 2 ou 11 mois, ou depuis toujours", () => {
    const local = new Date(2026, 10, 23, 15, 0).getTime(); // 23 novembre 2026, heure locale
    expect(new Date(periodStart("month", local)).toDateString()).toBe(new Date(2026, 10, 1).toDateString());
    expect(new Date(periodStart("3m", local)).toDateString()).toBe(new Date(2026, 8, 1).toDateString());
    expect(new Date(periodStart("12m", local)).toDateString()).toBe(new Date(2025, 11, 1).toDateString());
    expect(periodStart("all", local)).toBe(0);
  });

  it("marques les plus vendues, de la plus fréquente à la moins fréquente", () => {
    const parc = [v({ status: "sold", brand: "BMW" }), v({ status: "sold", brand: "Audi" }), v({ status: "sold", brand: "BMW" }), v({ brand: "Seat" })];
    expect(topBrands(parc, 2)).toEqual([{ brand: "BMW", count: 2 }, { brand: "Audi", count: 1 }]);
  });
});
