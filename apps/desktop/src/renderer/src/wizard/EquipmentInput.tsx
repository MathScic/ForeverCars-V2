import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

// Liste d'équipements sous forme de pastilles, comme sur la fiche du site.
export default function EquipmentInput({ value, onChange }: Props) {
  const [text, setText] = useState("");

  const add = () => {
    const item = text.trim();
    if (item && !value.includes(item)) onChange([...value, item]);
    setText("");
  };

  return (
    <div className="rounded-lg border border-brand-gray-medium/40 bg-brand-black p-2 focus-within:border-brand-orange">
      <div className="flex flex-wrap gap-2">
        {value.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 pl-3 pr-1 h-8 rounded-full bg-brand-gray-dark text-sm text-brand-gray-light">
            {item}
            <button
              type="button"
              aria-label={`Retirer ${item}`}
              onClick={() => onChange(value.filter((x) => x !== item))}
              className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder={value.length === 0 ? "GPS, caméra de recul…" : ""}
          className="flex-1 min-w-40 h-8 bg-transparent px-2 text-sm focus:outline-none placeholder:text-brand-gray-light/40"
          aria-label="Ajouter un équipement"
        />
      </div>
    </div>
  );
}
