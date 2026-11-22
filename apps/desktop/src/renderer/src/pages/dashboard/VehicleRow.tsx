import { computeMargin, formatMileage, formatPrice } from "@forevercars/shared";
import { FeaturedBadge, StatusBadge } from "../../ui/Badge";
import type { DemoVehicle } from "../../demo/types";
import VehicleActions from "./VehicleActions";

interface Props {
  vehicle: DemoVehicle;
  isAdmin: boolean;
}

export default function VehicleRow({ vehicle: v, isAdmin }: Props) {
  const cover = v.photos[0];
  const margin =
    v.purchasePrice !== undefined
      ? computeMargin({ salePrice: v.price, purchasePrice: v.purchasePrice, repairCost: v.repairCost })
      : null;

  return (
    <tr className="border-t border-brand-gray-medium/20 hover:bg-white/[0.02]">
      <td className="py-3 pl-5 pr-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-16 shrink-0 rounded-md overflow-hidden bg-brand-gray-medium">
            {cover ? (
              <img src={cover.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-[10px] text-brand-gray-light/60">
                Sans photo
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-brand-white truncate">
              {v.brand} {v.model}
            </p>
            <p className="text-xs text-brand-gray-light/70 truncate">{v.version || "Version à compléter"}</p>
            <div className="flex gap-2 mt-1.5">
              <StatusBadge status={v.status} />
              {v.isFeatured && <FeaturedBadge />}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 text-sm text-brand-gray-light font-mono">{v.fileNumber}</td>
      <td className="px-4 text-sm text-brand-gray-light tabular-nums">
        {v.year} · {formatMileage(v.mileage)}
      </td>
      <td className="px-4 text-right">
        <p className="font-display font-bold text-brand-orange tabular-nums">{formatPrice(v.price)}</p>
        {isAdmin && margin && (
          <p className={`text-xs tabular-nums ${margin.amount >= 0 ? "text-brand-success" : "text-brand-danger"}`}>
            marge {formatPrice(margin.amount)}
          </p>
        )}
      </td>
      <td className="pl-2 pr-3">
        <VehicleActions vehicle={v} />
      </td>
    </tr>
  );
}
