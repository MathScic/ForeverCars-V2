import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "md" | "lg" | "icon";

// Mêmes formes que les boutons du site : pilule, orange plein ou contour orange.
const variants: Record<Variant, string> = {
  primary: "bg-brand-orange text-brand-black hover:bg-brand-orange/90 font-semibold",
  outline: "border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-black font-semibold",
  ghost: "border border-brand-gray-medium/40 text-brand-gray-light hover:border-brand-orange/50 hover:text-brand-white",
  danger: "border border-brand-danger/50 text-brand-danger hover:bg-brand-danger/10",
};

// Cibles cliquables ≥ 44 px (h-11)
const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-sm",
  icon: "h-11 w-11 justify-center",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export default function Button({ variant = "primary", size = "md", className = "", type = "button", ...rest }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 rounded-full font-display transition-colors duration-300 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}
