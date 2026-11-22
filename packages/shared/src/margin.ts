export interface MarginInput {
  salePrice: number;
  purchasePrice: number;
  repairCost?: number;
}

export interface Margin {
  /** Marge brute en euros : prix de vente − (achat + frais). */
  amount: number;
  /** Taux de marge rapporté au prix de vente (0,12 = 12 %). 0 si le prix de vente est nul. */
  rate: number;
}

export function computeMargin({ salePrice, purchasePrice, repairCost = 0 }: MarginInput): Margin {
  const amount = salePrice - purchasePrice - repairCost;
  const rate = salePrice > 0 ? amount / salePrice : 0;
  return { amount, rate };
}
