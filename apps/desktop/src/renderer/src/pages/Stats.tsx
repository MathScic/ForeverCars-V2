import { useState, type ReactNode } from "react";
import { formatPrice } from "@forevercars/shared";
import { useDemoStore } from "../demo/store";
import Card from "../ui/Card";
import Bars from "../stats/Bars";
import HBar from "../stats/HBar";
import PeriodSwitch from "../stats/PeriodSwitch";
import { averageMarginRate, averageSaleDays, marginTotal, periodStart, salesByMonth, soldBetween, stockAgeBuckets, topBrands, type Period } from "../stats/stats";

function Panel({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <Card className="grid content-start gap-6 p-7">
      <div className="flex items-end justify-between gap-4">
        <h2 className="fc-h3">{title}</h2>
        {note && <span className="text-xs text-silver">{note}</span>}
      </div>
      {children}
    </Card>
  );
}

// Statistiques (maquette backoffice-stats.html). La marge, donnée interne, n'apparaît que pour l'admin.
export default function Stats() {
  const { state, isAdmin } = useDemoStore();
  const [period, setPeriod] = useState<Period>("12m");
  const [now] = useState(() => Date.now());
  const sold = soldBetween(state.vehicles, periodStart(period, now), now);
  const stock = state.vehicles.filter((v) => v.status === "online" || v.status === "reserved");
  const avg = averageSaleDays(sold);
  const ages = stockAgeBuckets(state.vehicles, now);
  const brands = topBrands(sold, 5);
  const rate = averageMarginRate(sold);
  const kpis: [string, string, string][] = [
    ["Ventes", String(sold.length), "véhicules vendus sur la période"],
    ["Chiffre d'affaires", formatPrice(sold.reduce((s, v) => s + v.price, 0)), "somme des prix affichés"],
    ["Délai moyen de vente", avg === null ? "—" : `${avg} j`, "de l'entrée en stock à la vente"],
    ["En stock", String(stock.length), `valeur ${formatPrice(stock.reduce((s, v) => s + v.price, 0))}`],
  ];

  return (
    <div className="@container mx-auto grid max-w-[1400px] gap-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="fc-eyebrow">Statistiques</span>
          <h1 className="fc-h2 mt-5">Les chiffres du garage</h1>
        </div>
        <PeriodSwitch value={period} onChange={setPeriod} />
      </div>

      <dl className="grid grid-cols-2 border-y border-line @min-[900px]:grid-cols-4">
        {kpis.map(([label, value, note]) => (
          <div key={label} className="border-line px-6 py-7 [&:not(:last-child)]:border-r">
            <dt className="fc-label">{label}</dt>
            <dd className="mt-4 font-display text-[30px] font-semibold leading-none tabular-nums [font-stretch:125%] @min-[1100px]:text-[34px]">{value}</dd>
            <dd className="mt-2.5 text-xs text-silver">{note}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 @min-[1000px]:grid-cols-[3fr_2fr]">
        <Panel title="Ventes par mois" note="12 derniers mois">
          <Bars data={salesByMonth(state.vehicles, now, 12)} height={220} highlight="max" labels ariaLabel="Ventes des 12 derniers mois" />
        </Panel>
        <Panel title="Ancienneté du stock">
          <div className="grid gap-3.5">
            {ages.map((b, i) => (
              <HBar key={b.label} label={b.label} value={String(b.count)} ratio={b.count / Math.max(1, stock.length)} warn={i >= 2} />
            ))}
          </div>
          <p className="text-xs text-silver">Au-delà de 60 jours, l&apos;app propose une baisse de prix sur la fiche.</p>
        </Panel>
      </div>

      <div className={`grid gap-6 ${isAdmin ? "@min-[1000px]:grid-cols-[3fr_2fr]" : ""}`}>
        <Panel title="Marques les plus vendues">
          {brands.length === 0 && <p className="text-sm text-silver">Aucune vente sur la période.</p>}
          <div className="grid gap-3.5">
            {brands.map((b) => (
              <HBar key={b.brand} label={b.brand} value={String(b.count)} ratio={b.count / brands[0]!.count} />
            ))}
          </div>
        </Panel>
        {isAdmin && (
          <Panel title="Marge" note="admin uniquement">
            <strong className="font-display text-[30px] font-semibold leading-none text-orange [font-stretch:125%]">{rate === null ? "—" : `≈ ${Math.round(rate * 100)} %`}</strong>
            <HBar label="Marge totale" value={formatPrice(marginTotal(sold))} ratio={rate === null ? 0 : Math.min(1, rate * 4)} />
            <p className="text-xs text-silver">Calculée sur les ventes de la période dont le prix d&apos;achat et les frais sont saisis.</p>
          </Panel>
        )}
      </div>
    </div>
  );
}
