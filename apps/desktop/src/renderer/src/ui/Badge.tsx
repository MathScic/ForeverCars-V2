import { Heart } from "lucide-react";
import type { VehicleStatus } from "../demo/types";

// Reprend les badges du site : « Nouveau » orange, « Réservé » blanc (ici « Vendu »).
const styles: Record<VehicleStatus, string> = {
  draft: "border border-brand-gray-medium text-brand-gray-light",
  online: "bg-brand-orange text-brand-black",
  sold: "bg-brand-white text-brand-black",
};

const labels: Record<VehicleStatus, string> = {
  draft: "Brouillon",
  online: "En ligne",
  sold: "Vendu",
};

export function StatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border border-brand-orange/60 text-brand-orange">
      <Heart size={12} className="fill-brand-orange" /> Coup de cœur
    </span>
  );
}
