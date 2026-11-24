// Modèle de l'ébauche, calqué sur le schéma prévu en phase 2 (table vehicles).
export type Role = "admin" | "seller";
/** « reserved » : toujours visible sur le site avec le badge Réservé (comme dans Sanity). */
export type VehicleStatus = "draft" | "online" | "reserved" | "sold";
export type Fuel = "essence" | "diesel" | "hybride" | "electrique";
export type Gearbox = "manuelle" | "automatique";

export interface Photo {
  id: string;
  url: string;
  name: string;
}

export interface DemoVehicle {
  id: string;
  /** Numéro de dossier interne (FC-2026-0007) : identifie le véhicule, plaque ou pas. */
  fileNumber: string;
  slug: string;
  /** Facultative : souvent masquée par une plaque « ForeverCars ». Sert à pré-remplir la fiche. */
  plate: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  fuel: Fuel;
  gearbox: Gearbox;
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
  /** Données internes, réservées à l'admin (future table vehicle_costs). */
  purchasePrice?: number;
  repairCost?: number;
  createdAt: string;
  updatedAt: string;
  soldAt?: string;
}

export interface ActivityEntry {
  id: string;
  at: string;
  actor: string;
  label: string;
}

export interface DemoState {
  role: Role;
  vehicles: DemoVehicle[];
  activity: ActivityEntry[];
}
