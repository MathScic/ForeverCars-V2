import { formatMileage, formatPrice } from "@forevercars/shared";
import Card from "../ui/Card";
import { FeaturedBadge, StatusBadge } from "../ui/Badge";
import SitePreviewCard from "./SitePreviewCard";
import type { StepProps } from "./Wizard";

const gearboxLabel = { manuelle: "Manuelle", automatique: "Automatique" } as const;

export default function StepPreview({ vehicle: v }: StepProps) {
  const rows: [string, string][] = [
    ["Plaque", v.plate || "—"],
    ["Version", v.version || "—"],
    ["Année", String(v.year)],
    ["Kilométrage", formatMileage(v.mileage)],
    ["Carburant", v.fuel],
    ["Boîte", gearboxLabel[v.gearbox]],
    ["Puissance", `${v.powerHp} ch`],
    ["Prix", formatPrice(v.price)],
    ["Photos", String(v.photos.length)],
    ["Équipements", v.equipment.join(", ") || "—"],
  ];

  return (
    <div className="grid grid-cols-[340px_1fr] gap-8 items-start">
      <div>
        <p className="text-xs uppercase tracking-wider text-brand-gray-light/70 mb-3">
          Aperçu sur forevercars.fr
        </p>
        <SitePreviewCard vehicle={v} />
      </div>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <StatusBadge status={v.status} />
          {v.isFeatured && <FeaturedBadge />}
        </div>
        <dl className="grid grid-cols-[140px_1fr] gap-y-2.5 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-brand-gray-light/70">{label}</dt>
              <dd className="text-brand-white first-letter:uppercase">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 pt-5 border-t border-brand-gray-medium/20">
          <p className="text-xs uppercase tracking-wider text-brand-orange mb-2">Description</p>
          <p className="text-sm text-brand-gray-light leading-relaxed whitespace-pre-line">{v.description}</p>
        </div>
      </Card>
    </div>
  );
}
