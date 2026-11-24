import type { CSSProperties } from "react";

interface Props {
  data: { label: string; count: number }[];
  /** Hauteur totale en px. */
  height?: number;
  /** Barre(s) en orange : la dernière (mois en cours) ou les plus hautes. */
  highlight?: "last" | "max";
  /** Valeurs au-dessus et mois en dessous des barres. */
  labels?: boolean;
  ariaLabel: string;
}

// Histogramme de la charte : barres grises, la ou les barres clés en orange lumineux ; elles montent à l'affichage.
export default function Bars({ data, height = 120, highlight = "last", labels = false, ariaLabel }: Props) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const summary = data.map((d) => `${d.label} ${d.count}`).join(", ");

  return (
    <div role="img" aria-label={`${ariaLabel} : ${summary}`} className="flex items-stretch gap-2" style={{ height }}>
      {data.map((d, i) => {
        const on = highlight === "last" ? i === data.length - 1 : d.count === max && d.count > 0;
        const bar = { height: `${(d.count / max) * 100}%`, "--d": `${i * 60}ms` } as CSSProperties;
        return (
          <div key={`${d.label}-${i}`} className="flex flex-1 flex-col items-center gap-2">
            {labels && <span className="text-[11px] tabular-nums text-silver">{d.count}</span>}
            <div className="flex w-full flex-1 items-end">
              <span className={`bar-rise block min-h-0.5 w-full rounded-[1px] ${on ? "bg-orange shadow-[0_0_16px_rgb(255_140_66/0.4)]" : "bg-line-strong"}`} style={bar} />
            </div>
            {labels && <span className="fc-label text-[9px]">{d.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
