import type { HTMLAttributes } from "react";

// Panneau de la charte : fond graphite, filet discret, angles nets.
export default function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-md border border-line bg-graphite ${className}`} {...rest} />;
}
