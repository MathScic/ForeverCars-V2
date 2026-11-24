import { Heart } from "lucide-react";
import type { ReactNode } from "react";
import type { VehicleStatus } from "../demo/types";

type Tone = "outline" | "orange" | "ivory" | "success" | "danger";

// Étiquettes de la charte (comme les badges du site) : petites capitales Archivo, angles nets.
const tones: Record<Tone, string> = {
  outline: "border border-line-strong text-silver",
  orange: "bg-orange text-carbon",
  ivory: "bg-ivory text-carbon",
  success: "border border-success/40 text-success",
  danger: "border border-orange/50 text-orange",
};

export function Tag({ tone = "outline", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-sm px-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] ${tones[tone]}`}>
      {children}
    </span>
  );
}

const statusTone: Record<VehicleStatus, Tone> = { draft: "outline", online: "outline", reserved: "ivory", sold: "orange" };
const statusLabel: Record<VehicleStatus, string> = { draft: "Brouillon", online: "En ligne", reserved: "Réservé", sold: "Vendu" };

export function StatusBadge({ status }: { status: VehicleStatus }) {
  return <Tag tone={statusTone[status]}>{statusLabel[status]}</Tag>;
}

export function FeaturedBadge() {
  return (
    <Tag tone="danger">
      <Heart size={11} className="fill-orange" /> Coup de cœur
    </Tag>
  );
}
