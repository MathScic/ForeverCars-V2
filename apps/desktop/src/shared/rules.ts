// Règles de publication : ce qu'une action change sur la fiche, et quand elle est refusée. Code pur.
import type { Vehicle, VehicleAct, VehicleStatus } from "./model";

export const nameOf = (v: Pick<Vehicle, "brand" | "model">) => `${v.brand} ${v.model}`.trim() || "Véhicule sans nom";

/** Ce qui manque pour publier (liste vide = publiable). Mêmes exigences que l'assistant. */
export function publishBlockers(v: Pick<Vehicle, "photos" | "price" | "description">): string[] {
  const missing: string[] = [];
  if (v.photos.length === 0) missing.push("au moins une photo");
  if (v.price <= 0) missing.push("un prix de vente");
  if (v.description.trim().length < 20) missing.push("une description de 20 caractères minimum");
  return missing;
}

export interface StatusPatch {
  status?: VehicleStatus;
  isFeatured?: boolean;
  publishedAt?: string | null;
  soldAt?: string | null;
}

/** Champs à écrire pour une action du parc. Lève une erreur lisible si l'action n'est pas permise. */
export function actionPatch(v: Vehicle, act: Exclude<VehicleAct, "remove">, now: string): StatusPatch {
  switch (act) {
    case "publish": {
      const missing = publishBlockers(v);
      if (missing.length) throw new Error(`Pour publier, il manque : ${missing.join(", ")}.`);
      // La date de première publication est gardée : elle donne le badge « Nouveau » du site (7 jours).
      return { status: "online", publishedAt: v.publishedAt ?? now, soldAt: null };
    }
    case "markSold":
      return { status: "sold", soldAt: now, isFeatured: false };
    case "toggleReserved":
      if (v.status !== "online" && v.status !== "reserved") throw new Error("Seul un véhicule visible sur le site peut être réservé.");
      return { status: v.status === "online" ? "reserved" : "online" };
    case "toggleFeatured":
      return { isFeatured: !v.isFeatured };
    case "unpublish":
      if (v.status !== "online" && v.status !== "reserved") throw new Error("Ce véhicule n'est pas affiché sur le site.");
      return { status: "draft", isFeatured: false };
  }
}

/** Phrase du journal d'activité (« Vendu : Peugeot 208 »), calculée avant l'action. */
export function actionLabel(v: Vehicle, act: VehicleAct): string {
  const labels: Record<VehicleAct, string> = {
    publish: "Mis en ligne",
    markSold: "Vendu",
    toggleReserved: v.status === "online" ? "Réservé" : "Remis en ligne",
    toggleFeatured: v.isFeatured ? "Retiré des coups de cœur" : "Coup de cœur",
    unpublish: "Retiré du site",
    remove: "Supprimé",
  };
  return `${labels[act]} : ${nameOf(v)}`;
}
