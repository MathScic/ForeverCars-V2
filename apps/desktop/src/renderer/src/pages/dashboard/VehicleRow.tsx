import { computeMargin, formatMileage, formatPrice } from "@forevercars/shared";
import { FeaturedBadge, StatusBadge } from "../../ui/Badge";
import type { DemoVehicle } from "../../demo/types";
import { daysInStock } from "../../stats/stats";
import VehicleActions from "./VehicleActions";

interface Props {
  vehicle: DemoVehicle;
  isAdmin: boolean;
  now: number;
}

const cell = "border-b border-line px-3 py-3.5 align-middle";

// Ligne du parc (maquette) : photo, dossier, ancienneté (orange au-delà de 60 j), prix, statut, actions.
export default function VehicleRow({ vehicle: v, isAdmin, now }: Props) {
  const cover = v.photos[0];
  const days = daysInStock(v, now);
  const dormant = days > 60 && (v.status === "online" || v.status === "reserved");
  const margin = v.purchasePrice !== undefined ? computeMargin({ salePrice: v.price, purchasePrice: v.purchasePrice, repairCost: v.repairCost }) : null;

  return (
    <tr className="transition-colors hover:bg-ivory/[0.02]">
      <td className={cell}>
        <div className="flex items-center gap-4">
          <div className="aspect-[4/3] w-[88px] shrink-0 overflow-hidden rounded-sm bg-graphite-2">
            {cover ? <img src={cover.url} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-[10px] text-silver">Sans photo</span>}
          </div>
          <div className="min-w-0">
            <p className="fc-model truncate text-[13px]">
              {v.brand} {v.model}
            </p>
            <p className="mt-1 truncate text-xs text-silver">
              {v.year} · {formatMileage(v.mileage)}
              <span className="font-mono @min-[1000px]:hidden"> · {v.fileNumber}</span>
            </p>
            {v.isFeatured && <div className="mt-2"><FeaturedBadge /></div>}
          </div>
        </div>
      </td>
      <td className={`${cell} hidden whitespace-nowrap font-mono text-xs text-silver @min-[1000px]:table-cell`}>{v.fileNumber}</td>
      <td className={`${cell} whitespace-nowrap tabular-nums`}>
        <span className={`inline-flex items-center gap-1.5 ${dormant ? "text-orange" : ""}`} title={dormant ? "Stock dormant : plus de 60 jours" : undefined}>
          {dormant && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-orange shadow-[0_0_8px_var(--color-orange)]" />}
          {days} j
        </span>
      </td>
      <td className={`${cell} whitespace-nowrap text-right`}>
        <p className="fc-price text-[17px]">{formatPrice(v.price)}</p>
        {isAdmin && margin && <p className={`mt-1 text-xs tabular-nums ${margin.amount >= 0 ? "text-success" : "text-danger"}`}>marge {formatPrice(margin.amount)}</p>}
      </td>
      <td className={cell}>
        <StatusBadge status={v.status} />
      </td>
      <td className={`${cell} pr-0`}>
        <VehicleActions vehicle={v} />
      </td>
    </tr>
  );
}
