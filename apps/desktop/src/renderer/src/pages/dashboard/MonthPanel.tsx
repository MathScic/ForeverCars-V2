import { useState } from "react";
import { formatPrice } from "@forevercars/shared";
import Card from "../../ui/Card";
import Bars from "../../stats/Bars";
import type { DemoVehicle } from "../../demo/types";
import { averageSaleDays, dormantCount, marginTotal, salesByMonth, soldBetween } from "../../stats/stats";

interface Props {
  vehicles: DemoVehicle[];
  isAdmin: boolean;
}

// Panneau « Stats du mois » de la maquette. La marge n'est montrée qu'à l'admin (donnée interne).
export default function MonthPanel({ vehicles, isAdmin }: Props) {
  const [now] = useState(() => Date.now());
  const start = new Date(now);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const sold = soldBetween(vehicles, start.getTime(), now);
  const avg = averageSaleDays(vehicles);
  const headline = isAdmin
    ? { label: "Marge totale", value: formatPrice(marginTotal(sold)) }
    : { label: "Chiffre d'affaires", value: formatPrice(sold.reduce((sum, v) => sum + v.price, 0)) };
  const rows: [string, string, boolean?][] = [
    ["Ventes", String(sold.length)],
    ["Délai moyen de vente", avg === null ? "—" : `${avg} jours`],
    ["Stock dormant (> 60 j)", `${dormantCount(vehicles, now)} véhicule(s)`, true],
  ];

  return (
    <Card className="grid gap-5 p-6">
      <span className="fc-eyebrow">Stats du mois</span>
      <div>
        <p className="text-[11px] text-silver">{headline.label}</p>
        <p className="mt-1.5 font-display text-[40px] font-semibold leading-none tabular-nums text-orange [font-stretch:125%]">{headline.value}</p>
      </div>
      <Bars data={salesByMonth(vehicles, now, 6)} ariaLabel="Ventes des 6 derniers mois" />
      <dl>
        {rows.map(([label, value, alert]) => (
          <div key={label} className="flex justify-between gap-4 border-t border-line py-3 text-sm">
            <dt className="text-silver">{label}</dt>
            <dd className={alert ? "text-orange" : ""}>{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
