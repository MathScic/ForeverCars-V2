interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

// Interrupteur avec titre et sous-titre, dans un cadre cliquable en entier (cible ≥ 44 px).
export default function Switch({ checked, onChange, label, description }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex min-h-16 w-full items-center gap-4 rounded-sm border px-4 py-3 text-left transition-colors duration-300 ${
        checked ? "border-orange/60 bg-orange/5" : "border-line-strong hover:border-silver"
      }`}
    >
      <span aria-hidden className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-orange" : "bg-graphite-2"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-ivory transition-transform duration-300 ease-[var(--ease-spring)] ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-ivory">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-silver">{description}</span>}
      </span>
    </button>
  );
}
