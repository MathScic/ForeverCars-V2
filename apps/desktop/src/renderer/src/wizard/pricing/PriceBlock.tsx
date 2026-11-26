import { useState } from "react";
import { formatPrice } from "@forevercars/shared";
import { TrendingUp } from "lucide-react";
import { useStore } from "../../data/store";
import { Field, Input } from "../../ui/Field";
import { estimateMarket } from "../../services/marketEstimate";
import type { StepProps } from "../Wizard";

const num = (value: string) => (value === "" ? 0 : Number(value));

// Prix affiché sur le site. Démo : estimation du marché simulée (aucun module d'estimation branché pour l'instant).
export default function PriceBlock({ vehicle: v, onChange, errors }: Omit<StepProps, "onPublish">) {
  const { mode } = useStore();
  const [currentYear] = useState(() => new Date().getFullYear());
  const estimate = estimateMarket(v, currentYear);

  return (
    <div className="space-y-4">
      <Field label="Prix de vente affiché (€)" error={errors.price}>
        <Input
          type="number"
          min={0}
          value={v.price || ""}
          onChange={(e) => onChange({ price: num(e.target.value) })}
          className="text-2xl! font-bold! h-14! tabular-nums"
        />
      </Field>
      {mode === "demo" && (
        <div className="rounded-md border border-orange/30 bg-orange/5 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-orange">
            <TrendingUp size={14} /> Estimation marché (simulation, module à venir)
          </p>
          {estimate ? (
            <>
              <p className="font-display text-lg font-bold mt-1 tabular-nums">
                {formatPrice(estimate.low)} – {formatPrice(estimate.high)}
              </p>
              <button
                type="button"
                onClick={() => onChange({ price: estimate.suggested })}
                className="mt-3 h-11 px-4 rounded-sm border border-orange text-orange font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] hover:bg-orange hover:text-carbon transition-colors"
              >
                Appliquer {formatPrice(estimate.suggested)}
              </button>
            </>
          ) : (
            <p className="text-sm text-silver mt-1">
              Complétez marque, modèle et puissance pour estimer.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
