// Pièces d'un dossier véhicule (maquette backoffice-docs.html) : 4 à fournir, 3 générées par l'app.
export interface DocType {
  id: string;
  name: string;
  /** « file » : pièce à ajouter (photo ou PDF) ; « gen » : document généré par l'app. */
  kind: "file" | "gen";
}

export const DOCS: DocType[] = [
  { id: "cg", name: "Carte grise (certificat d'immatriculation)", kind: "file" },
  { id: "ct", name: "Contrôle technique de moins de 6 mois", kind: "file" },
  { id: "nongage", name: "Certificat de situation administrative (non-gage)", kind: "file" },
  { id: "factures", name: "Factures d'entretien", kind: "file" },
  { id: "bdc", name: "Bon de commande", kind: "gen" },
  { id: "cession", name: "Déclaration de cession (Cerfa 15776)", kind: "gen" },
  { id: "facture", name: "Facture de vente", kind: "gen" },
];

export type DocState = Record<string, boolean> | undefined;

/** Nombre de pièces prêtes sur le total (les clés inconnues sont ignorées). */
export function docProgress(docs: DocState): { done: number; total: number } {
  return { done: DOCS.filter((d) => docs?.[d.id]).length, total: DOCS.length };
}

/** Première pièce à fournir encore manquante (rappel affiché en haut du dossier). */
export function firstMissing(docs: DocState): DocType | undefined {
  return DOCS.find((d) => d.kind === "file" && !docs?.[d.id]);
}

export const docName = (id: string) => DOCS.find((d) => d.id === id)?.name ?? id;
