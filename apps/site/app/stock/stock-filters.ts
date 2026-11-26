// Logique des filtres du stock (sans affichage) : appliquer les filtres, compter, résumer.
import type { Vehicle } from "@/lib/types/vehicle";
import type { FilterState } from "@/components/stock/VehicleFilter";

/** Marque regroupée par son premier mot (« Audi », « AUDI A1 … » → « AUDI »). */
export const brandKey = (v: Vehicle) => (v.brand.trim().split(/\s+/)[0] ?? "").toUpperCase();

export function applyFilters(list: Vehicle[], f: FilterState): Vehicle[] {
  return list.filter(
    (v) =>
      (f.brand === "Tous" || brandKey(v) === f.brand) &&
      (f.fuel === "Tous" || v.fuel === f.fuel) &&
      (f.transmission === "Tous" || v.transmission === f.transmission) &&
      v.price <= f.maxPrice,
  );
}

export function countText(total: number): string {
  if (total === 0) return "Aucun véhicule";
  if (total === 1) return "1 véhicule disponible";
  if (total > 30) return "+ de 30 véhicules disponibles";
  return `${total} véhicules disponibles`;
}

const FUEL: Record<string, string> = { essence: "Essence", diesel: "Diesel", hybride: "Hybride", electrique: "Électrique" };
const GEARBOX: Record<string, string> = { manuelle: "Manuelle", automatique: "Automatique" };

/** Résumé affiché sur la ligne « Filtres », même panneau fermé. */
export function filterSummary(f: FilterState, maxPriceLimit: number): { text: string; active: boolean } {
  const parts = [
    f.brand !== "Tous" && f.brand,
    f.fuel !== "Tous" && FUEL[f.fuel],
    f.transmission !== "Tous" && GEARBOX[f.transmission],
    f.maxPrice < maxPriceLimit && `${f.maxPrice.toLocaleString("fr-FR")} € max`,
  ].filter((p): p is string => Boolean(p));
  return parts.length ? { text: parts.join(" · "), active: true } : { text: "Marque, carburant, boîte, budget", active: false };
}
