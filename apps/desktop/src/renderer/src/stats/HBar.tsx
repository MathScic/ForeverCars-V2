interface Props {
  label: string;
  value: string;
  /** Longueur de la barre, de 0 à 1. */
  ratio: number;
  /** Barre orange lumineuse (ex. stock de plus de 60 jours). */
  warn?: boolean;
}

// Barre horizontale de la maquette : libellé, piste fine, valeur à droite ; la barre s'étire à l'affichage.
export default function HBar({ label, value, ratio, warn }: Props) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)_64px] items-center gap-3.5 text-[13px]">
      <span className="truncate">{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className={`bar-grow h-full rounded-full ${warn ? "bg-orange shadow-[0_0_12px_rgb(255_140_66/0.5)]" : "bg-ivory"}`}
          style={{ width: `${Math.round(Math.max(0, Math.min(1, ratio)) * 100)}%` }}
        />
      </div>
      <span className="text-right tabular-nums">{value}</span>
    </div>
  );
}
