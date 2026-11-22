import { formatMileage } from "@forevercars/shared";
import type { DemoVehicle } from "../demo/types";
import { GEARBOX_LABELS } from "./equipment";

type DescriptionInput = Pick<
  DemoVehicle,
  "brand" | "model" | "version" | "year" | "mileage" | "fuel" | "gearbox" | "powerHp" | "color" | "owners" | "equipment" | "warrantyMonths"
>;

const MOTOR = {
  essence: "Motorisation essence",
  diesel: "Motorisation diesel",
  hybride: "Motorisation hybride",
  electrique: "Motorisation électrique",
} as const;

/**
 * Rédige l'annonce à partir de la fiche, dans le ton du site.
 * Modèle local en attendant l'IA (Edge Function, phase 8) : même entrée, même sortie.
 */
export function generateDescription(v: DescriptionInput): string {
  const title = [v.brand, v.model, v.version].filter((s) => s.trim()).join(" ");
  const intro = `${title} de ${v.year}, ${formatMileage(v.mileage).replace(/ /g, " ")}.`;

  const details = [`${MOTOR[v.fuel]} de ${v.powerHp} ch`, `boîte ${GEARBOX_LABELS[v.gearbox].toLowerCase()}`];
  if (v.color.trim()) details.push(`teinte ${v.color.trim()}`);
  let engine = `${details.join(", ")}.`;
  if (v.owners === 1) engine += " Première main.";

  const paragraphs = [`${intro} ${engine}`];
  if (v.equipment.length > 0) paragraphs.push(`Équipements : ${v.equipment.join(", ")}.`);

  const warranty = v.warrantyMonths > 0 ? `, vendu avec une garantie de ${v.warrantyMonths} mois` : "";
  paragraphs.push(
    `Véhicule contrôlé et préparé par notre atelier${warranty}. Reprise de votre véhicule possible et financement sur demande. Venez l'essayer sur notre parc.`,
  );
  return paragraphs.join("\n\n");
}
