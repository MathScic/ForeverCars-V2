import type { DemoVehicle } from "../demo/types";

export interface MarketEstimate {
  low: number;
  high: number;
  /** Prix conseillé, au milieu de la fourchette. */
  suggested: number;
}

type EstimateInput = Pick<DemoVehicle, "brand" | "model" | "year" | "mileage" | "fuel" | "powerHp">;

const PREMIUM = new Set(["audi", "bmw", "mercedes-benz", "mercedes", "volvo", "lexus", "porsche", "tesla"]);
const round100 = (n: number) => Math.round(n / 100) * 100;

/**
 * SIMULATION d'estimation de marché (le vrai module, basé sur des annonces réelles,
 * reste à brancher). Formule indicative : valeur neuve selon la puissance,
 * décote annuelle, ajustement au kilométrage, bonus marque premium / hybride.
 */
export function estimateMarket(v: EstimateInput, currentYear: number): MarketEstimate | null {
  if (!v.brand.trim() || !v.model.trim() || v.year < 1990 || v.powerHp <= 0) return null;

  const age = Math.max(0, currentYear - v.year);
  const newValue = 13000 + v.powerHp * 120;
  const brandFactor = PREMIUM.has(v.brand.trim().toLowerCase()) ? 1.3 : 1;
  const fuelFactor = v.fuel === "hybride" || v.fuel === "electrique" ? 1.08 : 1;
  const expectedKm = Math.max(1, age) * 15000;
  const kmFactor = Math.min(1.1, Math.max(0.7, 1 - ((v.mileage - expectedKm) / 10000) * 0.02));

  const value = newValue * brandFactor * fuelFactor * Math.pow(0.88, age) * kmFactor;
  const low = round100(value * 0.965);
  const high = round100(value * 1.035);
  return { low, high, suggested: round100((low + high) / 2) };
}
