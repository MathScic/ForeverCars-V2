import type { HTMLAttributes } from "react";

// Carte du site : fond gris foncé, bordure subtile, rayon lg.
export default function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-brand-gray-dark rounded-lg border border-brand-gray-medium/20 ${className}`}
      {...rest}
    />
  );
}
