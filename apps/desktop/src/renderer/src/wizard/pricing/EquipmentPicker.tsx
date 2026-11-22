import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { EQUIPMENT_CATALOG } from "../../services/equipment";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

const chip = "h-11 px-4 inline-flex items-center gap-2 rounded-full text-sm font-medium border transition-colors";

// Un clic = l'équipement est présent sur le véhicule. La description se met à jour toute seule.
export default function EquipmentPicker({ value, onChange }: Props) {
  const [custom, setCustom] = useState("");
  const options = [...EQUIPMENT_CATALOG, ...value.filter((v) => !(EQUIPMENT_CATALOG as readonly string[]).includes(v))];
  const toggle = (item: string) => onChange(value.includes(item) ? value.filter((x) => x !== item) : [...value, item]);

  const addCustom = () => {
    const item = custom.trim();
    if (item && !value.includes(item)) onChange([...value, item]);
    setCustom("");
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Équipements">
      {options.map((item) => {
        const on = value.includes(item);
        return (
          <button
            key={item}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(item)}
            className={`${chip} ${
              on
                ? "bg-brand-orange border-brand-orange text-brand-black"
                : "bg-brand-black border-brand-gray-medium/50 text-brand-gray-light hover:border-brand-orange/60 hover:text-brand-white"
            }`}
          >
            {on && <Check size={14} />} {item}
          </button>
        );
      })}
      <span className={`${chip} pr-1 border-dashed border-brand-gray-medium/60 focus-within:border-brand-orange`}>
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          placeholder="Autre équipement…"
          aria-label="Ajouter un autre équipement"
          className="w-40 bg-transparent text-sm focus:outline-none placeholder:text-brand-gray-light/40"
        />
        <button type="button" onClick={addCustom} aria-label="Ajouter" className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-white/10">
          <Plus size={16} />
        </button>
      </span>
    </div>
  );
}
