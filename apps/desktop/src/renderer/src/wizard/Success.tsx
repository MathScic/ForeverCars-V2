import { Link, useParams } from "react-router";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { useStore } from "../data/store";
import SitePreviewCard from "./SitePreviewCard";

const pill =
  "h-12 px-8 inline-flex items-center gap-2 rounded-sm font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] transition-colors";

export default function Success() {
  const { id } = useParams();
  const { state, mode } = useStore();
  const vehicle = state.vehicles.find((v) => v.id === id);
  const visible = vehicle?.status === "online" || vehicle?.status === "reserved";

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 py-6">
      <CheckCircle2 size={56} className="mx-auto text-success" />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {vehicle ? `${vehicle.brand} ${vehicle.model} ${visible ? "est en ligne" : "est enregistré"}` : "Véhicule publié"}
        </h1>
        <p className="text-silver mt-2">
          {mode === "live"
            ? "L'annonce apparaît sur forevercars.fr en moins d'une minute (le temps que le site se mette à jour)."
            : "Démo : dans l'app branchée, l'annonce apparaît sur forevercars.fr en moins d'une minute."}
        </p>
      </div>
      {vehicle && (
        <div className="w-[340px] mx-auto text-left">
          <SitePreviewCard vehicle={vehicle} />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className={`${pill} border-2 border-orange text-orange hover:bg-orange hover:text-carbon`}>
          Retour au parc
        </Link>
        {mode === "live" && vehicle && visible && (
          // Ouvert dans le navigateur (seul forevercars.fr est autorisé par l'app).
          <a href={`https://forevercars.fr/stock/${vehicle.slug}`} target="_blank" rel="noreferrer" className={`${pill} border-2 border-line-strong text-ivory hover:border-ivory`}>
            Voir sur forevercars.fr <ExternalLink size={14} aria-hidden />
          </a>
        )}
        <Link to="/vendre" className={`${pill} bg-orange text-carbon hover:bg-orange/90`}>
          Mettre un autre véhicule en vente
        </Link>
      </div>
    </div>
  );
}
