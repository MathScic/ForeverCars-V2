import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "md" | "lg" | "icon";

// Boutons de la charte (comme le site) : rectangles nets, capitales Archivo espacées.
const variants: Record<Variant, string> = {
  primary: "bg-orange text-carbon hover:bg-orange/90",
  outline: "border border-orange text-orange hover:bg-orange hover:text-carbon",
  ghost: "border border-line-strong text-ivory hover:border-ivory",
  danger: "border border-danger/50 text-danger hover:bg-danger/10",
};

// Cibles cliquables ≥ 44 px (h-11). « icon » : bouton rond des actions de ligne.
const sizes: Record<Size, string> = {
  md: "h-11 px-6 rounded-sm",
  lg: "h-[54px] px-7 rounded-sm",
  icon: "h-11 w-11 justify-center rounded-full",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export default function Button({ variant = "primary", size = "md", className = "", type = "button", ...rest }: Props) {
  return (
    <button
      type={type}
      className={`group inline-flex items-center gap-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}

/** Flèche qui glisse au survol du bouton (comme sur le site). */
export function Arrow() {
  return (
    <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-1.5">
      →
    </span>
  );
}
