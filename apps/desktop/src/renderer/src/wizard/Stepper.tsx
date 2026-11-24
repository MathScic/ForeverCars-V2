import type { StepIndex } from "./draft";

interface Props {
  steps: readonly string[];
  current: StepIndex;
  /** Permet de revenir sur une étape déjà franchie. */
  onSelect: (step: StepIndex) => void;
}

// Onglets d'étapes de la maquette : « 01 · Identification », filet orange sur l'étape en cours et les étapes faites.
export default function Stepper({ steps, current, onSelect }: Props) {
  return (
    <ol className="grid grid-cols-4 gap-4" aria-label="Étapes de la mise en vente">
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
              className={`w-full border-t-2 pt-3.5 text-left font-display text-[10px] font-medium uppercase leading-snug tracking-[0.22em] [font-stretch:112%] transition-colors duration-300 disabled:cursor-default ${
                active ? "border-orange text-ivory" : done ? "border-orange/50 text-silver hover:text-ivory" : "border-line-strong text-silver"
              }`}
            >
              {String(i + 1).padStart(2, "0")} · {label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
