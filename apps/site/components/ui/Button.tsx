import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "pill" | "ghost";

// Boutons « Showroom Nocturne » : rectangles nets, capitales étendues espacées.
// Retour visuel immédiat à l'appui ; la flèche glisse au survol. 100 % CSS (composant serveur).
const base =
  "group inline-flex h-[54px] items-center gap-3.5 px-7 font-display text-xs font-semibold uppercase tracking-[0.2em] [font-stretch:112%] " +
  "transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.98] motion-reduce:active:scale-100 " +
  "disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "rounded-sm bg-orange text-carbon hover:bg-[#ffa266]",
  pill: "rounded-full bg-orange text-carbon hover:bg-[#ffa266]",
  ghost: "rounded-sm border border-line-strong text-ivory hover:border-ivory",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`.trim();
}

/** Flèche qui glisse au survol du bouton parent. */
export const Arrow = () => (
  <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-1.5">
    →
  </span>
);

interface Common {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export default function Button(props: AsLink | AsButton) {
  const { variant, className, children, ...rest } = props;
  const cls = buttonClasses(variant, className);
  if (typeof rest.href === "string") {
    const { href, ...anchor } = rest as Omit<AsLink, keyof Common>;
    return href.startsWith("/") ? (
      <Link href={href} className={cls} {...anchor}>{children}</Link>
    ) : (
      <a href={href} className={cls} {...anchor}>{children}</a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as Omit<AsButton, keyof Common>)}>
      {children}
    </button>
  );
}
