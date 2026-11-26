// Modèle d'un véhicule tel que l'app l'affiche et le modifie (renderer et process main, aucune dépendance).
export type Role = "admin" | "seller";
/** « reserved » : toujours visible sur le site avec le badge Réservé. */
export type VehicleStatus = "draft" | "online" | "reserved" | "sold";
export type Fuel = "essence" | "diesel" | "hybride" | "electrique";
export type Gearbox = "manuelle" | "automatique";
export type Body = "berline" | "suv" | "coupe" | "break" | "citadine" | "utilitaire" | "cabriolet" | "monospace";

export interface Photo {
  id: string;
  url: string;
  name: string;
}

export interface Vehicle {
  id: string;
  /** Numéro de dossier interne (FC-2026-0007) : identifie le véhicule, plaque ou pas. */
  fileNumber: string;
  /** Adresse de la fiche sur le site (/stock/…) ; figée une fois le véhicule publié. */
  slug: string;
  /** Facultative : souvent masquée par une plaque « ForeverCars ». */
  plate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  fuel: Fuel;
  gearbox: Gearbox;
  body?: Body | null;
  powerHp: number;
  mileage: number;
  color: string;
  owners: number;
  warrantyMonths: number;
  price: number;
  description: string;
  /** true tant que la description suit les équipements ; false dès qu'on la retouche à la main. */
  descriptionIsAuto: boolean;
  equipment: string[];
  status: VehicleStatus;
  isFeatured: boolean;
  exportLeboncoin: boolean;
  exportLaCentrale: boolean;
  /** Ordre d'affichage ; la première photo est la couverture. */
  photos: Photo[];
  /** Pièces du dossier administratif prêtes (id de documents/catalog.ts → true). */
  documents?: Record<string, boolean>;
  /** Données internes, réservées à l'admin (table vehicle_costs). */
  purchasePrice?: number;
  repairCost?: number;
  createdAt: string;
  updatedAt: string;
  soldAt?: string;
  publishedAt?: string | null;
  /** Version en base (0 = jamais enregistré) : détecte une modification faite entre-temps sur un autre poste. */
  revision?: number;
}

/** « unpublish » : retiré du site (repasse en brouillon) ; « remove » : supprimé définitivement. */
export type VehicleAct = "publish" | "markSold" | "toggleReserved" | "toggleFeatured" | "unpublish" | "remove";

export interface ActivityEntry {
  id: string;
  at: string;
  actor: string;
  label: string;
}

/** Membre de l'équipe (écran Équipe, admin uniquement). */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Accès retiré : compte bloqué, rien n'est effacé. */
  disabled: boolean;
  lastSignIn: string | null;
  createdAt: string;
}

/** La personne connectée (profil de la table profiles). */
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: Role;
}
