import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/Field";
import { DEMO_PLATES, demoPlateLookup, type PlateResult } from "../services/plateLookup";
import { normalizePlate } from "./draft";

interface Props {
  plate: string;
  error?: string;
  onPlate: (plate: string) => void;
  onFound: (result: PlateResult) => void;
}

type Status = "idle" | "loading" | "found" | "missing";

// Facultatif : retrouver un véhicule par sa plaque pour pré-remplir la fiche.
export default function PlateLookupBox({ plate, error, onPlate, onFound }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  const search = async () => {
    const normalized = normalizePlate(plate);
    onPlate(normalized);
    setStatus("loading");
    const result = await demoPlateLookup.find(normalized);
    if (result) onFound(result);
    setStatus(result ? "found" : "missing");
  };

  return (
    <div className="rounded-md border border-line bg-carbon/40 p-5">
      <p className="text-sm font-semibold">Pré-remplir avec la plaque (facultatif)</p>
      <p className="text-xs text-silver mt-1">
        Si le véhicule a encore sa plaque, on retrouve la fiche. Sinon, saisissez tout à la main.
      </p>
      <div className="mt-4 flex gap-3">
        <div className="flex-1">
          <Input
            aria-label="Plaque d'immatriculation"
            value={plate}
            onChange={(e) => onPlate(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="GH-218-KT"
            className="font-mono"
          />
        </div>
        <button
          type="button"
          onClick={search}
          disabled={!plate.trim() || status === "loading"}
          className="h-11 px-5 inline-flex items-center gap-2 rounded-sm border border-orange text-orange font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] hover:bg-orange hover:text-carbon transition-colors disabled:opacity-40"
        >
          {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Rechercher
        </button>
      </div>
      <p role="status" className="text-xs mt-2 min-h-4">
        {error ? <span className="text-danger">{error}</span> : null}
        {!error && status === "found" && <span className="text-success">Fiche pré-remplie : vérifiez les champs ci-dessous.</span>}
        {!error && status === "missing" && <span className="text-orange">Plaque inconnue : complétez la fiche à la main.</span>}
        {!error && status === "idle" && (
          <span className="text-silver">Démo : essayez {DEMO_PLATES.join(", ")}</span>
        )}
      </p>
    </div>
  );
}
