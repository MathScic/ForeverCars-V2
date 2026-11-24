// Calculs du parc et des statistiques (fonctions pures, testées dans stats.test.ts).
import { computeMargin } from "@forevercars/shared";
import type { DemoVehicle } from "../demo/types";

const DAY = 86_400_000;
const isSold = (v: DemoVehicle) => v.status === "sold" && Boolean(v.soldAt);
const isVisible = (v: DemoVehicle) => v.status === "online" || v.status === "reserved";

/** Jours passés en stock : de l'entrée jusqu'à aujourd'hui, ou jusqu'à la vente. */
export function daysInStock(v: DemoVehicle, now: number): number {
  const end = isSold(v) ? Date.parse(v.soldAt!) : now;
  return Math.max(0, Math.round((end - Date.parse(v.createdAt)) / DAY));
}

/** Véhicules visibles sur le site depuis plus de `threshold` jours (alerte de stock dormant). */
export function dormantCount(vehicles: DemoVehicle[], now: number, threshold = 60): number {
  return vehicles.filter((v) => isVisible(v) && daysInStock(v, now) > threshold).length;
}

/** Délai moyen entre l'entrée en stock et la vente, en jours (null sans vente). */
export function averageSaleDays(vehicles: DemoVehicle[]): number | null {
  const sold = vehicles.filter(isSold);
  if (sold.length === 0) return null;
  return Math.round(sold.reduce((sum, v) => sum + daysInStock(v, 0), 0) / sold.length);
}

/** Ventes par mois sur les `months` derniers mois (mois en cours inclus), du plus ancien au plus récent. */
export function salesByMonth(vehicles: DemoVehicle[], now: number, months: number) {
  const ref = new Date(now);
  const slots = Array.from({ length: months }, (_, i) => {
    const d = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() - (months - 1 - i), 1));
    const label = d.toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" });
    return { key: d.getUTCFullYear() * 12 + d.getUTCMonth(), label, count: 0 };
  });
  for (const v of vehicles.filter(isSold)) {
    const d = new Date(v.soldAt!);
    const slot = slots.find((s) => s.key === d.getUTCFullYear() * 12 + d.getUTCMonth());
    if (slot) slot.count += 1;
  }
  return slots.map(({ label, count }) => ({ label, count }));
}

export type Period = "month" | "3m" | "12m" | "all";

/** Début d'une période de l'écran Statistiques (heure locale), 0 pour « Tout ». */
export function periodStart(period: Period, now: number): number {
  const d = new Date(now);
  const back = { month: 0, "3m": 2, "12m": 11 } as const;
  return period === "all" ? 0 : new Date(d.getFullYear(), d.getMonth() - back[period], 1).getTime();
}

/** Véhicules vendus entre deux instants (bornes incluses). */
export function soldBetween(vehicles: DemoVehicle[], from: number, to: number): DemoVehicle[] {
  return vehicles.filter((v) => isSold(v) && Date.parse(v.soldAt!) >= from && Date.parse(v.soldAt!) <= to);
}

/** Marge brute cumulée des véhicules dont le prix d'achat est connu (donnée réservée à l'admin). */
export function marginTotal(vehicles: DemoVehicle[]): number {
  return vehicles
    .filter((v) => v.purchasePrice !== undefined)
    .reduce((sum, v) => sum + computeMargin({ salePrice: v.price, purchasePrice: v.purchasePrice!, repairCost: v.repairCost }).amount, 0);
}

/** Taux de marge moyen (0,15 = 15 %) des véhicules au prix d'achat connu, ou null. */
export function averageMarginRate(vehicles: DemoVehicle[]): number | null {
  const withCosts = vehicles.filter((v) => v.purchasePrice !== undefined);
  if (withCosts.length === 0) return null;
  const rates = withCosts.map((v) => computeMargin({ salePrice: v.price, purchasePrice: v.purchasePrice!, repairCost: v.repairCost }).rate);
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

/** Ancienneté du stock visible sur le site, en 4 tranches. */
export function stockAgeBuckets(vehicles: DemoVehicle[], now: number) {
  const buckets = [
    { label: "0 – 30 j", max: 30, count: 0 },
    { label: "31 – 60 j", max: 60, count: 0 },
    { label: "61 – 90 j", max: 90, count: 0 },
    { label: "+ 90 j", max: Infinity, count: 0 },
  ];
  for (const v of vehicles.filter(isVisible)) buckets.find((b) => daysInStock(v, now) <= b.max)!.count += 1;
  return buckets.map(({ label, count }) => ({ label, count }));
}

/** Marques les plus vendues. */
export function topBrands(vehicles: DemoVehicle[], limit: number) {
  const counts = new Map<string, number>();
  for (const v of vehicles.filter((x) => x.status === "sold")) counts.set(v.brand, (counts.get(v.brand) ?? 0) + 1);
  return [...counts]
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand))
    .slice(0, limit);
}
