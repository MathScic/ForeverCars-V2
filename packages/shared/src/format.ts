// Formats français (fr-FR). Intl insère des espaces insécables fines (U+202F) comme séparateurs.
const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 18990 → « 18 990 € » */
export function formatPrice(euros: number): string {
  return priceFormatter.format(euros);
}

/** 45000 → « 45 000 km » */
export function formatMileage(km: number): string {
  return `${numberFormatter.format(km)}\u00a0km`;
}
