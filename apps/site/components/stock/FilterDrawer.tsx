"use client";

import { useId, type ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

interface Props {
  open: boolean;
  onToggle: () => void;
  /** Filtres actifs en clair (« BMW · Diesel »), lisibles même panneau fermé. */
  summary: { text: string; active: boolean };
  children: ReactNode;
}

// Filtres repliés par défaut : une seule ligne, la flèche ouvre ou ferme le panneau.
export default function FilterDrawer({ open, onToggle, summary, children }: Props) {
  const id = useId();
  return (
    <div className="rounded-md border border-line bg-graphite">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="flex min-h-14 w-full items-center gap-4 rounded-md px-4 text-left transition-colors duration-300 hover:bg-graphite-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange md:px-7"
      >
        <SlidersHorizontal size={18} aria-hidden className="shrink-0 text-orange" />
        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.26em] [font-stretch:112%]">Filtres</span>
        <span className={`min-w-0 flex-1 truncate text-sm ${summary.active ? "text-ivory" : "text-silver"}`}>{summary.text}</span>
        <ChevronDown
          size={20}
          aria-hidden
          className={`shrink-0 text-silver transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* Hauteur animée sans la mesurer : la ligne de grille passe de 0fr à 1fr. */}
      <div
        id={id}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden" inert={!open}>
          {children}
        </div>
      </div>
    </div>
  );
}
