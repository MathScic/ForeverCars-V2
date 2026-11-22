import { useState } from "react";
import { computeMargin, formatPrice } from "@forevercars/shared";
import Card from "../../ui/Card";
import type { DemoVehicle } from "../../demo/types";

const THIRTY_DAYS = 30 * 86_400_000;

function averageMarginRate(vehicles: DemoVehicle[]): number | null {
  const withCosts = vehicles.filter((v) => v.purchasePrice !== undefined);
  if (withCosts.length === 0) return null;
  const sum = withCosts.reduce(
    (acc, v) => acc + computeMargin({ salePrice: v.price, purchasePrice: v.purchasePrice!, repairCost: v.repairCost }).rate,
    0,
  );
  return sum / withCosts.length;
}

interface Props {
  vehicles: DemoVehicle[];
  isAdmin: boolean;
}

export default function Kpis({ vehicles, isAdmin }: Props) {
  // Heure de référence figée au montage (le rendu doit rester pur).
  const [now] = useState(() => Date.now());
  const online = vehicles.filter((v) => v.status === "online");
  const drafts = vehicles.filter((v) => v.status === "draft").length;
  const soldRecently = vehicles.filter(
    (v) => v.status === "sold" && v.soldAt && now - Date.parse(v.soldAt) < THIRTY_DAYS,
  ).length;
  const stockValue = online.reduce((acc, v) => acc + v.price, 0);
  const margin = averageMarginRate(online);

  const items = [
    { label: "En ligne", value: String(online.length) },
    { label: "Brouillons", value: String(drafts) },
    { label: "Vendus (30 jours)", value: String(soldRecently) },
    { label: "Valeur du stock en ligne", value: formatPrice(stockValue) },
    ...(isAdmin
      ? [{ label: "Marge moyenne (admin)", value: margin === null ? "—" : `${Math.round(margin * 100)} %` }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <p className="text-xs uppercase tracking-wider text-brand-gray-light/70">{item.label}</p>
          <p className="font-display text-2xl font-bold text-brand-white mt-2 tabular-nums">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
