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
      className={`w-full min-h-16 flex items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors ${
        checked ? "border-brand-orange/60 bg-brand-orange/5" : "border-brand-gray-medium/40 hover:border-brand-gray-medium"
      }`}
    >
      <span
        aria-hidden
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand-orange" : "bg-brand-gray-medium"}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-brand-white transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
      <span>
        <span className="block text-sm font-semibold text-brand-white">{label}</span>
        {description && <span className="block text-xs text-brand-gray-light/70 mt-0.5">{description}</span>}
      </span>
    </button>
  );
}
