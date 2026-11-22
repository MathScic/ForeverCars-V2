import type { DemoVehicle } from "../demo/types";

export type PlateResult = Pick<
  DemoVehicle,
  "brand" | "model" | "version" | "year" | "fuel" | "gearbox" | "powerHp" | "color"
>;

/**
 * Interface de recherche par plaque. L'implémentation réelle (module SIV payant)
 * viendra plus tard ; ici, un petit registre de démonstration.
 */
export interface PlateLookup {
  find(plate: string): Promise<PlateResult | null>;
}

const DEMO_REGISTRY: Record<string, PlateResult> = {
  "GH-218-KT": { brand: "Toyota", model: "Yaris", version: "Hybride 116h Iconic", year: 2022, fuel: "hybride", gearbox: "automatique", powerHp: 116, color: "Gris Platine" },
  "FK-731-RB": { brand: "Renault", model: "Captur", version: "TCe 140 Techno", year: 2022, fuel: "essence", gearbox: "automatique", powerHp: 140, color: "Blanc Nacré" },
  "EZ-904-MJ": { brand: "Ford", model: "Puma", version: "1.0 EcoBoost 125 mHEV ST-Line", year: 2021, fuel: "hybride", gearbox: "manuelle", powerHp: 125, color: "Bleu Desert Island" },
};

/** Plaques de démonstration, affichées dans l'interface pour pouvoir essayer. */
export const DEMO_PLATES = Object.keys(DEMO_REGISTRY);

export function findInDemoRegistry(plate: string): PlateResult | null {
  return DEMO_REGISTRY[plate.trim().toUpperCase()] ?? null;
}

export const demoPlateLookup: PlateLookup = {
  // Petit délai pour simuler l'appel réseau du futur module SIV.
  find: (plate) => new Promise((resolve) => setTimeout(() => resolve(findInDemoRegistry(plate)), 400)),
};
