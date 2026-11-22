import { Check } from "lucide-react";
import type { StepIndex } from "./draft";

interface Props {
  steps: readonly string[];
  current: StepIndex;
  /** Permet de revenir sur une étape déjà franchie. */
  onSelect: (step: StepIndex) => void;
}

export default function Stepper({ steps, current, onSelect }: Props) {
  return (
    <ol className="grid grid-cols-4 gap-3" aria-label="Étapes de la mise en vente">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label}>
            <button
              type="button"
              disabled={!done}
              onClick={() => onSelect(i as StepIndex)}
              aria-current={active ? "step" : undefined}
              className="w-full text-left disabled:cursor-default"
            >
              <span
                className={`block h-1 rounded-full mb-3 transition-colors ${
                  done || active ? "bg-brand-orange" : "bg-brand-gray-medium/40"
                }`}
              />
              <span className="flex items-center gap-2 text-sm">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    done
                      ? "bg-brand-orange text-brand-black"
                      : active
                        ? "border-2 border-brand-orange text-brand-orange"
                        : "border border-brand-gray-medium text-brand-gray-light/60"
                  }`}
                >
                  {done ? <Check size={14} /> : i + 1}
                </span>
                <span className={active ? "text-brand-white font-semibold" : "text-brand-gray-light/70"}>
                  {label}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
