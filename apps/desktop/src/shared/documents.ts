// Pièces du dossier d'un véhicule : identifiant de l'écran Documents ↔ type en base (vehicle_documents.doc_type).
export const DOC_TYPE_BY_ID = {
  cg: "carte_grise",
  ct: "controle_technique",
  nongage: "non_gage",
  factures: "factures_entretien",
  bdc: "bon_de_commande",
  cession: "cession",
  facture: "facture_vente",
} as const;

export type DocId = keyof typeof DOC_TYPE_BY_ID;
export type DocType = (typeof DOC_TYPE_BY_ID)[DocId];

export const DOC_IDS = Object.keys(DOC_TYPE_BY_ID) as DocId[];
export const docIdOf = (type: string): DocId | undefined => DOC_IDS.find((id) => DOC_TYPE_BY_ID[id] === type);

/** Fichiers acceptés pour une pièce : PDF ou photo/scan. */
export const DOC_EXTENSIONS: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".heic": "image/heic",
};
