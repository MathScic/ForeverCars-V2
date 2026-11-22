import { useState } from "react";
import { formatPrice } from "@forevercars/shared";
import { TrendingUp } from "lucide-react";
import { Field, Input } from "../../ui/Field";
import { estimateMarket } from "../../services/marketEstimate";
import type { StepProps } from "../Wizard";

const num = (value: string) => (value === "" ? 0 : Number(value));

// Prix affiché sur le site + estimation du marché avec bouton « Appliquer ».
export default function PriceBlock({ vehicle: v, onChange, errors }: Omit<StepProps, "onPublish">) {
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
      <div className="rounded-lg border border-brand-orange/30 bg-brand-orange/5 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-brand-orange">
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
              className="mt-3 h-11 px-4 rounded-full border-2 border-brand-orange text-brand-orange text-sm font-semibold hover:bg-brand-orange hover:text-brand-black transition-colors"
            >
              Appliquer {formatPrice(estimate.suggested)}
            </button>
          </>
        ) : (
          <p className="text-sm text-brand-gray-light/70 mt-1">Complétez marque, modèle et puissance pour estimer.</p>
        )}
      </div>
    </div>
  );
}
