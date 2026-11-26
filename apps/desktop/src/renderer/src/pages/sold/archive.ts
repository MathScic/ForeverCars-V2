// Ventes « archivées » : vendues depuis plus de 7 jours, elles quittent le parc pour la page Vendus.
import type { Vehicle } from "../../../../shared/model";

export const ARCHIVE_AFTER_DAYS = 7;
const DAY = 86_400_000;

export function isArchivedSale(v: Pick<Vehicle, "status" | "soldAt">, now: number): boolean {
  if (v.status !== "sold" || !v.soldAt) return false;
  return now - Date.parse(v.soldAt) > ARCHIVE_AFTER_DAYS * DAY;
}

/** Le parc (stock, brouillons, ventes récentes) et les ventes archivées, les plus récentes d'abord. */
export function splitParc(vehicles: Vehicle[], now: number): { parc: Vehicle[]; archived: Vehicle[] } {
  const parc: Vehicle[] = [];
  const archived: Vehicle[] = [];
  for (const v of vehicles) (isArchivedSale(v, now) ? archived : parc).push(v);
  archived.sort((a, b) => (b.soldAt ?? "").localeCompare(a.soldAt ?? ""));
  return { parc, archived };
}
