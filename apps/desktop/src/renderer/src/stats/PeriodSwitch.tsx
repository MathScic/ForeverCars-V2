import type { Period } from "./stats";

const PERIODS: { value: Period; label: string }[] = [
  { value: "month", label: "Ce mois" },
  { value: "3m", label: "3 mois" },
  { value: "12m", label: "12 mois" },
  { value: "all", label: "Tout" },
];

// Sélecteur segmenté de la maquette : pilules, la période choisie passe en ivoire.
export default function PeriodSwitch({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div role="group" aria-label="Période" className="inline-flex gap-1 rounded-full border border-line-strong p-1">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          aria-pressed={value === p.value}
          onClick={() => onChange(p.value)}
          className={`h-11 rounded-full px-[18px] text-[13px] transition-colors duration-300 ${
            value === p.value ? "bg-ivory font-semibold text-carbon" : "text-silver hover:text-ivory"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
