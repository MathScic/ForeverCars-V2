import { Sparkles } from "lucide-react";
import { Textarea } from "../../ui/Field";
import type { DemoVehicle } from "../../demo/types";

interface Props {
  vehicle: DemoVehicle;
  error?: string;
  onChange: (patch: Partial<DemoVehicle>) => void;
}

export default function DescriptionEditor({ vehicle: v, error, onChange }: Props) {
  const words = v.description.trim() ? v.description.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <label htmlFor="annonce-description" className="text-xs uppercase tracking-wider text-silver">
          Description de l&apos;annonce
        </label>
        <button
          type="button"
          // Repasse en mode automatique : la description est régénérée depuis la fiche.
          onClick={() => onChange({ descriptionIsAuto: true })}
          className="h-11 px-4 inline-flex items-center gap-2 rounded-sm bg-orange/10 border border-orange/40 text-orange font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] hover:bg-orange/20 transition-colors"
        >
          <Sparkles size={16} /> {v.descriptionIsAuto ? "Régénérer" : "Générer avec l'IA"}
        </button>
      </div>
      <Textarea
        id="annonce-description"
        rows={8}
        value={v.description}
        // Toute retouche manuelle arrête la mise à jour automatique.
        onChange={(e) => onChange({ description: e.target.value, descriptionIsAuto: false })}
        placeholder="Cliquez sur « Générer avec l'IA » ou rédigez l'annonce…"
      />
      <p className="mt-1.5 text-xs">
        {error ? (
          <span className="text-danger">{error}</span>
        ) : (
          <span className="text-silver">
            {words} mots ·{" "}
            {v.descriptionIsAuto
              ? "rédigée automatiquement, elle suit les équipements cochés (modèle local en attendant l'IA)"
              : "modifiée à la main"}
          </span>
        )}
      </p>
    </div>
  );
}
