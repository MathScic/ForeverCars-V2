import { useState } from "react";
import { formatPrice } from "@forevercars/shared";
import type { DemoVehicle } from "../../demo/types";
import { averageMarginRate, soldBetween } from "../../stats/stats";

const THIRTY_DAYS = 30 * 86_400_000;

interface Props {
  vehicles: DemoVehicle[];
  isAdmin: boolean;
}

// Bandeau d'indicateurs de la maquette : 5 colonnes séparées par des filets.
export default function Kpis({ vehicles, isAdmin }: Props) {
  // Heure de référence figée au montage (le rendu doit rester pur).
  const [now] = useState(() => Date.now());
  const online = vehicles.filter((v) => v.status === "online");
  const reserved = vehicles.filter((v) => v.status === "reserved");
  const visible = [...online, ...reserved];
  const soldRecently = soldBetween(vehicles, now - THIRTY_DAYS, now).length;
  const margin = averageMarginRate(visible);

  const items = [
    { label: "En ligne", value: String(online.length) },
    { label: "Réservés", value: String(reserved.length) },
    { label: "Vendus (30 j)", value: String(soldRecently) },
    { label: "Valeur du stock", value: formatPrice(visible.reduce((acc, v) => acc + v.price, 0)) },
    isAdmin
      ? { label: "Marge moyenne", value: margin === null ? "—" : `${Math.round(margin * 100)} %` }
      : { label: "Brouillons", value: String(vehicles.filter((v) => v.status === "draft").length) },
  ];

  return (
    // 5 colonnes quand la zone de contenu le permet, sinon 3 (requête de conteneur posée par la page).
    <dl className="grid grid-cols-3 border-y border-line @min-[1000px]:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="border-line px-6 py-6 [&:not(:last-child)]:border-r">
          <dt className="fc-label whitespace-nowrap">{item.label}</dt>
          <dd className="mt-4 whitespace-nowrap font-display text-[26px] font-semibold leading-none tabular-nums [font-stretch:125%] @min-[1200px]:text-4xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
