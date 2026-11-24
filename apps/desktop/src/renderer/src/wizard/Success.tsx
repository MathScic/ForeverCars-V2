import { Link, useParams } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { useDemoStore } from "../demo/store";
import SitePreviewCard from "./SitePreviewCard";

const pill =
  "h-12 px-8 inline-flex items-center rounded-sm font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] transition-colors";

export default function Success() {
  const { id } = useParams();
  const { state } = useDemoStore();
  const vehicle = state.vehicles.find((v) => v.id === id);

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 py-6">
      <CheckCircle2 size={56} className="mx-auto text-success" />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {vehicle ? `${vehicle.brand} ${vehicle.model} est en ligne` : "Véhicule publié"}
        </h1>
        <p className="text-silver mt-2">
          Simulation : dans la version finale, l&apos;annonce apparaîtra sur forevercars.fr en moins
          d&apos;une minute.
        </p>
      </div>
      {vehicle && (
        <div className="w-[340px] mx-auto text-left">
          <SitePreviewCard vehicle={vehicle} />
        </div>
      )}
      <div className="flex justify-center gap-3">
        <Link to="/" className={`${pill} border-2 border-orange text-orange hover:bg-orange hover:text-carbon`}>
          Retour au parc
        </Link>
        <Link to="/vendre" className={`${pill} bg-orange text-carbon hover:bg-orange/90`}>
          Mettre un autre véhicule en vente
        </Link>
      </div>
    </div>
  );
}
